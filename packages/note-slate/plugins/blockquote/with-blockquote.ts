import { Editor, Element, Node, Point, Range, Transforms } from 'slate'

const BLOCKQUOTE_REG_EXP = /^ {0,3}> /

export default function withBlockquote(editor: Editor) {
  const { insertText, deleteBackward } = editor

  editor.insertText = (text) => {
    insertText(text)

    if (text.length === 1 && editor.selection && Range.isCollapsed(editor.selection)) {
      const paragraph = Editor.above(editor, {
        match: (node) => Element.isElement(node) && node.type === 'paragraph',
      })
      if (paragraph) {
        const text = Node.string(paragraph[0])
        if (BLOCKQUOTE_REG_EXP.test(text)) {
          editor.deleteBackward('word')
          Transforms.wrapNodes(editor, { type: 'blockquote', children: [] })
          return
        }
      }
    }
  }

  editor.deleteBackward = (unit) => {
    if (unit === 'character' && editor.selection && Range.isCollapsed(editor.selection)) {
      const blockquote = Editor.above(editor, {
        match: (node) => Element.isElement(node) && node.type === 'blockquote',
      })
      if (
        blockquote &&
        Point.equals(editor.selection.anchor, Editor.start(editor, blockquote[1]))
      ) {
        Transforms.unwrapNodes(editor, {
          match: (node) => Element.isElement(node) && node.type === 'blockquote',
        })
        return
      }
    }

    deleteBackward(unit)
  }

  return editor
}
