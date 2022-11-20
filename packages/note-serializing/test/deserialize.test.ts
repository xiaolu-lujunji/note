import deserialize from '../deserialize'

describe('deserialize', () => {
  describe('Common Mark', () => {
    it('should be able to parse paragraph.', () => {
      expect(
        deserialize(`
This is a paragraph.
`)
      ).toEqual([
        {
          type: 'paragraph',
          children: [{ text: 'This is a paragraph.' }],
        },
      ])
    })

    it('should be able to parse code.', () => {
      expect(
        deserialize(`
\`\`\`javascript
function main() {
  console.log("Hello, JavaScript!");
}
`)
      ).toEqual([
        {
          type: 'code',
          lang: 'javascript',
          meta: null,
          children: [
            {
              type: 'codeLine',
              children: [
                {
                  text: 'function main() {',
                },
              ],
            },
            {
              type: 'codeLine',
              children: [
                {
                  text: '  console.log("Hello, JavaScript!");',
                },
              ],
            },
            {
              type: 'codeLine',
              children: [
                {
                  text: '}',
                },
              ],
            },
          ],
        },
      ])
    })
  })
})
