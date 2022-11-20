import type { Text } from 'slate'
import { CodeSyntax } from '@note/slate/custom-types'

export function isCodeSyntax(text: Text): text is CodeSyntax {
  // @ts-ignore
  return Boolean(text.tokenType)
}
