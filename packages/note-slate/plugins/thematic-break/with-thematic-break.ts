import { Editor, Element, Node, Point, Range, Transforms } from 'slate'

const THEMATIC_BREAK_REG_EXP = /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/

export default function withThematicBreak(editor: Editor) {
  const { isVoid, insertBreak } = editor

  editor.isVoid = (element) => element.type === 'thematicBreak' || isVoid(element)

  editor.insertBreak = () => {
    if (editor.selection && Range.isCollapsed(editor.selection)) {
      const paragraph = Editor.above(editor, {
        match: (node) => Element.isElement(node) && node.type === 'paragraph',
      })
      if (paragraph) {
        const text = Node.string(paragraph[0])
        if (
          THEMATIC_BREAK_REG_EXP.test(text) &&
          Point.equals(editor.selection.anchor, Editor.end(editor, paragraph[1]))
        ) {
          Transforms.setNodes(editor, { type: 'thematicBreak' })
          Transforms.insertNodes(editor, { type: 'paragraph', children: [{ text: '' }] })
          return
        }
      }
    }

    insertBreak()
  }

  return editor
}
