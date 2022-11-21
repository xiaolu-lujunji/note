export interface Paragraph {
  type: 'paragraph'
  children: Text[]
}

export interface Heading {
  type: 'heading'
  depth: 1 | 2 | 3 | 4 | 5 | 6
  children: Text[]
}

export interface Code {
  type: 'code'
  lang: string
  children: CodeLine[]
}

export interface CodeLine {
  type: 'codeLine'
  children: CodeSyntax[]
}

export interface CodeSyntax extends Text {
  tokenType: string
}

export interface Text {
  text: string
}

export type CustomElement = Paragraph | Code | CodeLine | Heading

export type CustomText = Text | CodeSyntax
