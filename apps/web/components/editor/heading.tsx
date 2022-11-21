import { createElement } from 'react'
import type { RenderElementProps } from 'slate-react'
import type * as customTypes from '@note/slate/custom-types'

export default function Heading(props: RenderElementProps) {
  const { attributes, element, children } = props

  const { depth } = element as customTypes.Heading

  return createElement(`h${depth}`, attributes, children)
}
