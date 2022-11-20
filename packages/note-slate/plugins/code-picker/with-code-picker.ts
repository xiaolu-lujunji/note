import { Editor, Element, Node, Range } from 'slate'
import eventEmitter from './event-emitter'

function checkInputLanguage(editor: Editor) {
  if (editor.selection && Range.isCollapsed(editor.selection)) {
    const paragraph = Editor.above(editor, {
      match: (node) => Element.isElement(node),
    })
    if (paragraph) {
      const paragraphContent = Node.string(paragraph[0])
      const capture = paragraphContent.match(/(^`{3,})([^`]+)/)
      if (capture) {
        const language = capture[2]
        eventEmitter.emit('open-code-picker', { inputLanguage: language })
      }
    }
  }
}

export default function withCodePicker(editor: Editor) {
  const { insertText, deleteBackward } = editor

  editor.insertText = (text: string) => {
    insertText(text)

    checkInputLanguage(editor)
  }

  editor.deleteBackward = (unit) => {
    deleteBackward(unit)

    checkInputLanguage(editor)
  }

  return editor
}
