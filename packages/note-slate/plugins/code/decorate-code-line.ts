import { Editor, Element, Node } from 'slate'
import type { NodeEntry, Range } from 'slate'

export default function decorateCodeLine(editor: Editor, [node, path]: NodeEntry, Prism): Range[] {
  const ranges: Range[] = []

  if (Element.isElement(node) && node.type === 'codeLine') {
    const code = Editor.parent(editor, path)
    if (code) {
      const lang = code[0].lang
      const language = Prism.languages[lang]
      if (language) {
        const text = Node.string(node)
        const tokens = Prism.tokenize(text, language)

        let offset = 0
        for (const token of tokens) {
          if (token instanceof Prism.Token) {
            ranges.push({
              anchor: { path, offset },
              focus: { path, offset: offset + token.length },
              tokenType: token.type,
            })
          }
          offset += token.length
        }
      }
    }
  }

  return ranges
}
