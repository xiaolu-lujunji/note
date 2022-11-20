import { styled } from '@mui/material/styles'
import clsx from 'clsx'
import type { RenderElementProps } from 'slate-react'
import type * as customTypes from '@note/slate/custom-types'

const Pre = styled('pre')({
  padding: 14,
  border: '1px solid rgba(0, 0, 0, 0.1)',
  backgroundColor: 'rgba(0, 0, 0, 0.03)',
  borderRadius: 3,
})

const StyledCode = styled('code')({
  // fontSize: 16,
  // fontFamily: '"Lucida Console",Consolas,"Courier",monospace',
  // tabSize: 2,
  // borderRadius: 3,
  // backgroundColor: 'rgb(247, 246, 243)',
})

export default function Code(props: RenderElementProps) {
  const { element, attributes, children } = props

  const { lang } = element as customTypes.Code

  return (
    <Pre {...attributes}>
      <StyledCode className={clsx(lang, `language-${lang}`)}>{children}</StyledCode>
    </Pre>
  )
}
