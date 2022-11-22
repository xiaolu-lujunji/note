import type { RenderElementProps } from 'slate-react'

export default function Blockquote(props: RenderElementProps) {
  const { attributes, children } = props

  return <blockquote {...attributes}>{children}</blockquote>
}
