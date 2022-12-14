import Container from '@mui/material/Container'
import Editor from '../components/editor'
import { useMemo } from 'react'
import { createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { withReact } from 'slate-react'
import { withCode } from '@note/slate/plugins/code'
import { withCodePicker } from '@note/slate/plugins/code-picker'
import { withHeading } from '@note/slate/plugins/heading'
import { withThematicBreak } from '@note/slate/plugins/thematic-break'
import { withBlockquote } from '@note/slate/plugins/blockquote'
import { withList } from '@note/slate/plugins/list'
import deserialize from '@note/serializing/deserialize'
import type { Descendant } from 'slate'

const INITIAL_VALUE = deserialize(`
This is a paragraph

# heading one
## heading two
### heading three

---

This is a paragraph

> blockquote

- Common Mark
- Github Flavored Markdown
- Frontmatter

1. First
2. Second
3. Third

\`\`\`javascript
function main() {
  console.log("Hello, JavaScript!");
}
\`\`\`
`) as Descendant[]

export default function Web() {
  const editor = useMemo(
    () =>
      withList(
        withBlockquote(
          withThematicBreak(
            withHeading(withCode(withCodePicker(withReact(withHistory(createEditor())))))
          )
        )
      ),
    []
  )

  return (
    <div>
      <Container className="markdown-body">
        <Editor editor={editor} initialValue={INITIAL_VALUE} />
      </Container>
    </div>
  )
}
