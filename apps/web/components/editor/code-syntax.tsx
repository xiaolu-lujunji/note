import clsx from 'clsx'
import type { RenderLeafProps } from 'slate-react'
import type * as customTypes from '@note/slate/custom-types'

export default function CodeSyntax(props: RenderLeafProps) {
  const { leaf, attributes, children } = props

  return (
    <span
      {...attributes}
      className={clsx('prism-token', 'token', (leaf as customTypes.CodeSyntax).tokenType)}
    >
      {children}
    </span>
  )
}
