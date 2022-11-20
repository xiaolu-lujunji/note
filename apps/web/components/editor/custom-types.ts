export interface ParagraphElement {
  type: 'paragraph'
  children: Text[]
}

export interface CodeElement {
  type: 'code'
  children: CodeLineElement[]
}

export interface CodeLineElement {
  type: 'codeLine'
  children: CodeSyntaxText[]
}

export interface CodeSyntaxText extends Text {
  tokenType: string
}

export interface Text {
  text: string
}

export type CustomElement = ParagraphElement | CodeElement | CodeLineElement

export type CustomText = Text | CodeSyntaxText
