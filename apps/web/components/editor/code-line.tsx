import type { RenderElementProps } from 'slate-react'

export default function CodeLine(props: RenderElementProps) {
  const { attributes, children } = props

  return <div {...attributes}>{children}</div>
}
