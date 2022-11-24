import { Editor, Element, Node, Point, Range, Transforms } from 'slate'

const LIST_REG_EXP = /^ {0,3}(?:[*+-]|(\d{1,9})(?:\.|\))) /

export default function withList(editor: Editor) {
  const { insertText, insertBreak } = editor

  editor.insertText = (text) => {
    insertText(text)

    if (text.length === 1 && editor.selection && Range.isCollapsed(editor.selection)) {
      const paragraph = Editor.above(editor, {
        match: (node) => Element.isElement(node) && node.type === 'paragraph',
      })
      if (paragraph) {
        const text = Node.string(paragraph[0])
        const cap = LIST_REG_EXP.exec(text)
        if (cap) {
          const [, start] = cap
          editor.deleteBackward('word')
          Transforms.wrapNodes(editor, {
            type: 'list',
            ordered: Boolean(start),
            start: globalThis.parseInt(start, 10),
            children: [],
          })
          Transforms.wrapNodes(editor, { type: 'listItem', children: [] })
          return
        }
      }
    }
  }

  editor.insertBreak = () => {
    if (editor.selection && Range.isCollapsed(editor.selection)) {
      const listItem = Editor.above(editor, {
        match: (node) => Element.isElement(node) && node.type === 'listItem',
      })
      if (listItem) {
        Transforms.splitNodes(editor, {
          match: (node) => Element.isElement(node) && node.type === 'listItem',
          always: true,
        })
        return
      }
    }

    insertBreak()
  }

  return editor
}
