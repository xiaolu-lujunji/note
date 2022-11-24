import type { RenderElementProps } from 'slate-react'

export default function ListItem(props: RenderElementProps) {
  const { attributes, children } = props

  return <li {...attributes}>{children}</li>
}
