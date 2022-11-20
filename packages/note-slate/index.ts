import type { BaseEditor, BaseRange } from 'slate'
import type { ReactEditor } from 'slate-react'
import type * as customTypes from './custom-types'

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: customTypes.CustomElement
    Text: customTypes.CustomText
    Range: BaseRange & {
      tokenType?: string
    }
  }
}
