import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import { remarkToSlate } from 'remark-slate-transformer'
import type * as mdast from 'mdast'

function buildCode({ type, value, lang, meta }: mdast.Code) {
  let lines = value.split('\n')

  if (lines.length === 0) {
    lines = [value]
  }

  const codeLines = lines.map((line) => ({
    type: 'codeLine',
    children: [{ text: line }],
  }))

  return {
    type,
    lang,
    meta,
    children: codeLines,
  }
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkFrontmatter)
  .use(remarkToSlate, {
    overrides: {
      code: buildCode,
    },
  })

export default function deserialize(markdown: string) {
  return processor.processSync(markdown).result
}
