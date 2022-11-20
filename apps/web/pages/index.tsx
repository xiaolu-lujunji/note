import Container from '@mui/material/Container'
import Editor from '../components/editor'
import { useMemo } from 'react'
import { createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { withReact } from 'slate-react'
import { withCode } from '@note/slate/plugins/code'
import { withCodePicker } from '@note/slate/plugins/code-picker'
import deserialize from '@note/serializing/deserialize'
import type { Descendant } from 'slate'

const INITIAL_VALUE = deserialize(`
This is a paragraph.

\`\`\`javascript
function main() {
  console.log("Hello, JavaScript!");
}
\`\`\`
`) as Descendant[]

export default function Web() {
  const editor = useMemo(() => withCode(withCodePicker(withReact(withHistory(createEditor())))), [])

  return (
    <div>
      <Container>
        <Editor editor={editor} initialValue={INITIAL_VALUE} />
      </Container>
    </div>
  )
}
