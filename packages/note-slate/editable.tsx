import { Editable as EditableBase } from 'slate-react'
import { useCallback } from 'react'
import eventEmitter from './event-emitter'
import type { EditableProps } from 'slate-react/dist/components/editable'

export default function Editable(props: EditableProps) {
  const { onKeyDown, ...other } = props

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event)

      if (!event.isDefaultPrevented()) {
        eventEmitter.emit('onKeyDown', event)
      }
    },
    [onKeyDown]
  )

  return <EditableBase onKeyDown={handleKeyDown} {...other} />
}
