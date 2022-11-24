export interface Paragraph {
  type: 'paragraph'
  children: Text[]
}

export interface Heading {
  type: 'heading'
  depth: 1 | 2 | 3 | 4 | 5 | 6
  children: Text[]
}

interface Void {
  children: [{ text: '' }]
}

export interface ThematicBreak extends Void {
  type: 'thematicBreak'
}

export interface Blockquote {
  type: 'blockquote'
  children: FlowContent[]
}

export interface List {
  type: 'list'
  ordered: boolean
  start: number | null
  children: ListItem[]
}

export interface ListItem {
  type: 'listItem'
  children: FlowContent[]
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

type Content = Paragraph

type FlowContent = Blockquote | Heading | Content

export type CustomElement =
  | Paragraph
  | Code
  | CodeLine
  | Heading
  | ThematicBreak
  | Blockquote
  | List
  | ListItem

export type CustomText = Text | CodeSyntax
