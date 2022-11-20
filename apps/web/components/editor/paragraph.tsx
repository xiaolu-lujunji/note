import type { RenderElementProps } from 'slate-react'

export default function Paragraph(props: RenderElementProps) {
  const { attributes, children } = props

  return <p {...attributes}>{children}</p>
}
