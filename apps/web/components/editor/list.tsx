import type { RenderElementProps } from 'slate-react'
import type * as customTypes from '@note/slate/custom-types'

export default function List(props: RenderElementProps) {
  const { attributes, element, children } = props

  const { ordered, start } = element as customTypes.List

  if (ordered) {
    return (
      <ol {...attributes} start={start!}>
        {children}
      </ol>
    )
  }

  return <ul {...attributes}>{children}</ul>
}
