import { Editor, Element, Node, Point, Range, Transforms } from 'slate'

const HEADING_REG_EXP = /^ {0,3}(#{1,6})\s/

export default function withHeading(editor: Editor) {
  const { insertBreak, insertText, deleteBackward } = editor

  editor.insertBreak = () => {
    let atEnd = false

    if (editor.selection && Range.isCollapsed(editor.selection)) {
      const heading = Editor.above(editor, {
        match: (node) => Element.isElement(node) && node.type === 'heading',
      })
      atEnd = Boolean(
        heading && Point.equals(editor.selection.anchor, Editor.end(editor, heading[1]))
      )
    }

    insertBreak()

    if (atEnd) {
      Transforms.setNodes(
        editor,
        { type: 'paragraph' },
        {
          match: (node) => Element.isElement(node) && node.type === 'heading',
        }
      )
    }
  }

  editor.insertText = (text) => {
    insertText(text)

    if (/\s/.test(text) && editor.selection && Range.isCollapsed(editor.selection)) {
      const paragraph = Editor.above(editor, {
        match: (node) => Element.isElement(node) && node.type === 'paragraph',
      })
      if (paragraph) {
        const text = Node.string(paragraph[0])
        const cap = HEADING_REG_EXP.exec(text)
        if (cap) {
          const [, numberSign] = cap
          const depth = numberSign.length as 1 | 2 | 3 | 4 | 5 | 6
          editor.deleteBackward('word')
          Transforms.setNodes(
            editor,
            { type: 'heading', depth },
            {
              at: paragraph[1],
            }
          )
          return
        }
      }
    }
  }

  editor.deleteBackward = (unit) => {
    if (unit === 'character' && editor.selection && Range.isCollapsed(editor.selection)) {
      const heading = Editor.above(editor, {
        match: (node) => Element.isElement(node) && node.type === 'heading',
      })
      if (heading && Point.equals(editor.selection.anchor, Editor.start(editor, heading[1]))) {
        Transforms.setNodes(editor, { type: 'paragraph' })
        return
      }
    }

    deleteBackward(unit)
  }

  return editor
}
