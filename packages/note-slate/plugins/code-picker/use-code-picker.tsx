import { useState, useEffect, useMemo, useCallback } from 'react'
import { ReactEditor, useSlateStatic } from 'slate-react'
import { useFloating } from '@floating-ui/react-dom-interactions'
import { Editor, Element } from 'slate'
import Fuse from 'fuse.js'
import { languages } from 'prismjs/components'
import eventEmitter from './event-emitter'

const fuse = new Fuse(Object.keys(languages))

export default function useCodePicker() {
  const editor = useSlateStatic()

  const [open, setOpen] = useState(false)
  const { x, y, reference, floating, strategy } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'bottom-start',
  })

  const [language, setLanguage] = useState('')

  const searchResults = useMemo(() => fuse.search(language), [language])

  useEffect(() => {
    console.log('useEffect')
    const handler = ({ inputLanguage }: { inputLanguage: string }) => {
      const node = Editor.above(editor, {
        match: (node) => Element.isElement(node),
      })
      if (node) {
        const domNode = ReactEditor.toDOMNode(editor, node[0])
        if (domNode) {
          reference(domNode)
          setOpen(true)
          setLanguage(inputLanguage)
        }
      }
    }
    eventEmitter.on('open-code-picker', handler)

    return () => {
      eventEmitter.off('open-code-picker', handler)
    }
  }, [editor, reference])

  const handleClose = useCallback((selectedLanguage: string | undefined) => {
    setOpen(false)
    console.log(selectedLanguage)
  }, [])

  return { open, handleClose, x, y, floating, strategy, searchResults }
}
