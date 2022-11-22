import { DefaultElement, DefaultLeaf, Slate } from 'slate-react'
import { CodePlugin, decorateCodeLine } from '@note/slate/plugins/code'
import Editable from '@note/slate/editable'
import CodePicker from './code-picker'
import Paragraph from './paragraph'
import Code from './code'
import CodeLine from './code-line'
import CodeSyntax from './code-syntax'
import Heading from './heading'
import ThematicBreak from './thematic-break'
import Blockquote from './blockquote'
import { useCallback } from 'react'
import Prism from 'prismjs'
import eventEmitter from './event-emitter'
import { isCodeSyntax } from './detect-type'
import type {
  BaseEditor,
  BaseRange,
  Descendant,
  Editor as SlateEditor,
  NodeEntry,
  Range,
} from 'slate'
import type { ReactEditor, RenderElementProps, RenderLeafProps } from 'slate-react'
import type * as customTypes from '@note/slate/custom-types'

// Prevent any elements from being automatically highlighted
if (typeof window !== 'undefined') {
  window.Prism.manual = true
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: customTypes.CustomElement
    Text: customTypes.CustomText
    Range: BaseRange & {
      tokenType?: string
    }
  }
}

interface EditorProps {
  editor: SlateEditor
  initialValue: Descendant[]
}

export default function Editor(props: EditorProps) {
  const { editor, initialValue } = props

  const decorate = useCallback(
    (entry: NodeEntry): Range[] => {
      return decorateCodeLine(editor, entry, Prism)
    },
    [editor]
  )

  const renderElement = useCallback((props: RenderElementProps) => {
    const { element } = props
    switch (element.type) {
      case 'paragraph':
        return <Paragraph {...props} />
      case 'heading':
        return <Heading {...props} />
      case 'thematicBreak':
        return <ThematicBreak {...props} />
      case 'blockquote':
        return <Blockquote {...props} />
      case 'code':
        return <Code {...props} />
      case 'codeLine':
        return <CodeLine {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    const { leaf } = props

    if (isCodeSyntax(leaf)) return <CodeSyntax {...props} />

    return <DefaultLeaf {...props} />
  }, [])

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    eventEmitter.emit('onKeyDown', event)
  }, [])

  return (
    <Slate editor={editor} value={initialValue}>
      <CodePicker />
      <CodePlugin />
      <Editable
        decorate={decorate}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={handleKeyDown}
      />
    </Slate>
  )
}
