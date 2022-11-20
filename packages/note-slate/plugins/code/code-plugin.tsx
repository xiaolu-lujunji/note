import { useEffect } from 'react'
import { Editor, Element, Transforms } from 'slate'
import { useSlateStatic } from 'slate-react'
import eventEmitter from '../../event-emitter'
import HOTKEYS from '../../utils/hotkeys'

export default function CodePlugin() {
  const editor = useSlateStatic()

  useEffect(() => {
    const handler = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.isDefaultPrevented()) return

      if (HOTKEYS.isSelectAll(event)) {
        const code = Editor.above(editor, {
          match: (node) => Element.isElement(node) && node.type === 'code',
        })
        if (code) {
          event.preventDefault()
          Transforms.setSelection(editor, {
            anchor: Editor.start(editor, code[1]),
            focus: Editor.end(editor, code[1]),
          })
        }
      } else if (HOTKEYS.isTab(event)) {
        const code = Editor.above(editor, {
          match: (node) => Element.isElement(node) && node.type === 'code',
        })
        if (code) {
          event.preventDefault()
          editor.insertText('  ')
        }
      } else if (HOTKEYS.isShiftTab(event)) {
        const code = Editor.above(editor, {
          match: (node) => Element.isElement(node) && node.type === 'code',
        })
        if (code) {
          event.preventDefault()
          Transforms.move(editor, {
            reverse: true,
            distance: 2,
            unit: 'character',
          })
        }
      }
    }

    eventEmitter.on('onKeyDown', handler)

    return () => {
      eventEmitter.off('onKeyDown', handler)
    }
  }, [editor])

  return null
}
