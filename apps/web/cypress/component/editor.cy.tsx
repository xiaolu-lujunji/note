import Editor from '../../components/editor'
import { createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { withReact } from 'slate-react'
import { withCode } from '@note/slate/plugins/code'
import { withCodePicker } from '@note/slate/plugins/code-picker'
import deserialize from '@note/serializing/deserialize'
import type { Descendant } from 'slate'
import '../../styles/prism-ghcolors.css'

describe('code', () => {
  it('auto closing quotes', () => {
    const editor = withCodePicker(withCode(withReact(withHistory(createEditor()))))

    const value = deserialize(`
This is a paragraph.

\`\`\`javascript

`) as Descendant[]

    cy.mount(<Editor editor={editor} initialValue={value}></Editor>)

    const preElement = 'pre[data-slate-node="element"]'

    cy.get(preElement).click().type('(').should('have.text', '()')

    cy.get(preElement).type('(').should('have.text', '(())')

    cy.get(preElement)
      .type(')')
      .should('have.text', '(())')
      .then(() => {
        expect(editor.selection?.anchor.offset).equal(3)
      })
  })
})
