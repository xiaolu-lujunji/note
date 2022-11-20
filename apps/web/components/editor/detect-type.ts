import type { Text } from 'slate'
import { CodeSyntaxText } from './custom-types'

export function isCodeSyntax(text: Text): text is CodeSyntaxText {
  return Boolean(text.tokenType)
}
