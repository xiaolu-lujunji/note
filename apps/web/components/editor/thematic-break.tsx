import type { RenderElementProps } from 'slate-react'

export default function ThematicBreak(props: RenderElementProps) {
  const { attributes, children } = props

  return (
    <div {...attributes} contentEditable={false}>
      {children}
      <hr></hr>
    </div>
  )
}
