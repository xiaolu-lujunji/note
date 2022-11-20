import { Editor, Element, Node, Range, Transforms } from 'slate'

const BRACKET_HASH = {
  '{': '}',
  '[': ']',
  '(': ')',
}

const QUOTE_HASH = {
  '"': '"',
  "'": "'",
}

const isLeftBracket = (character: string): character is '{' | '[' | '(' =>
  /[\{\[\(]{1}/.test(character)

const isRightBracket = (character: string): character is '}' | ']' | '(' =>
  /[\}\]\)]{1}/.test(character)

const shouldAutoClosingBrackets = (
  character: string,
  preCharacter: string,
  postCharacter: string
) => {
  return (
    isLeftBracket(character) &&
    (!/[\S]{1}/.test(postCharacter) ||
      (isLeftBracket(preCharacter) && isRightBracket(postCharacter)))
  )
}

const isQuote = (character: string): character is "'" | '"' => /['"]{1}/.test(character)

const shouldAutoClosingQuotes = (
  character: string,
  preCharacter: string,
  postCharacter: string
) => {
  return (
    (/[']{1}/.test(character) &&
      !/[a-zA-Z\d]{1}/.test(preCharacter) &&
      !/[\S]{1}/.test(postCharacter)) ||
    (/["]{1}/.test(character) && !/[\S]{1}/.test(postCharacter))
  )
}

export default function withCode(editor: Editor) {
  const { insertText, deleteBackward } = editor

  editor.insertText = (text: string) => {
    if (text.length === 1 && editor.selection && Range.isCollapsed(editor.selection)) {
      const codeLine = Editor.above(editor, {
        match: (node) => Element.isElement(node) && node.type === 'codeLine',
      })
      if (codeLine) {
        const line = Node.string(codeLine[0])
        const offset = editor.selection.anchor.offset

        const preCharacter = line.slice(offset - 1, offset)
        const postCharacter = line.slice(offset, offset + 1)
        const character = text

        if (shouldAutoClosingBrackets(character, preCharacter, postCharacter)) {
          editor.insertText(character + BRACKET_HASH[character as '{' | '[' | '('])
          Transforms.move(editor, {
            distance: 1,
            unit: 'character',
            reverse: true,
          })
          return
        }

        if (shouldAutoClosingQuotes(character, preCharacter, postCharacter)) {
          editor.insertText(character + QUOTE_HASH[character as "'" | '"'])
          Transforms.move(editor, {
            reverse: true,
            distance: 1,
            unit: 'character',
          })
          return
        }

        if (character === postCharacter && (isRightBracket(character) || isQuote(character))) {
          Transforms.move(editor, {
            reverse: false,
            distance: 1,
            unit: 'character',
          })
          return
        }
      }
    }

    insertText(text)
  }

  editor.deleteBackward = (unit) => {
    if (unit === 'character' && editor.selection && Range.isCollapsed(editor.selection)) {
      const codeLine = Editor.above(editor, {
        match: (node) => Element.isElement(node) && node.type === 'codeLine',
      })
      if (codeLine) {
        const line = Node.string(codeLine[0])
        const offset = editor.selection.anchor.offset

        const preCharacter = line.slice(offset - 1, offset)
        const postCharacter = line.slice(offset, offset + 1)

        if (isLeftBracket(preCharacter) && postCharacter === BRACKET_HASH[preCharacter]) {
          editor.deleteForward(unit)
        }

        if (isQuote(preCharacter) && postCharacter === QUOTE_HASH[preCharacter]) {
          editor.deleteForward(unit)
        }
      }
    }

    deleteBackward(unit)
  }

  return editor
}
