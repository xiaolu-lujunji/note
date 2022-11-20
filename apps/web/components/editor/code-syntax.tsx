import clsx from 'clsx'
import type { RenderLeafProps } from 'slate-react'

export default function CodeSyntax(props: RenderLeafProps) {
  const { leaf, attributes, children } = props

  return (
    <span {...attributes} className={clsx('prism-token', 'token', leaf.tokenType)}>
      {children}
    </span>
  )
}
