import List from '@mui/material/List'
import MenuItem from '@mui/material/MenuItem'
import { useCodePicker } from '@note/slate/plugins/code-picker'
import { useEffect, useRef } from 'react'
import {
  unstable_useEventCallback as useEventCallback,
  unstable_useForkRef as useForkRef,
} from '@mui/utils'
import eventEmitter from './event-emitter'

export default function CodePicker() {
  const { open, handleClose, x, y, floating, strategy, searchResults } = useCodePicker()

  const listRef = useRef<HTMLUListElement>(null)
  const handleRef = useForkRef(listRef, floating)

  const defaultHighlighted = 0
  const includeInputInList = false
  const disableListWrap = false
  const disabledItemsFocusable = true
  const groupBy = false

  const openRef = useRef(false)
  openRef.current = open
  const highlightedIndexRef = useRef(defaultHighlighted)

  function validOptionIndex(index: number, direction: 'next' | 'previous') {
    if (!listRef.current || index === -1) {
      return -1
    }

    let nextFocus = index

    while (true) {
      // Out of range
      if (
        (direction === 'next' && nextFocus === searchResults.length) ||
        (direction === 'previous' && nextFocus === -1)
      ) {
        return -1
      }

      const option = listRef.current.querySelector(`[data-option-index="${nextFocus}"]`)

      // Same logic as MenuList.js
      const nextFocusDisabled = disabledItemsFocusable
        ? false
        : // @ts-ignore
          !option || option.disabled || option.getAttribute('aria-disabled') === 'true'

      if ((option && !option.hasAttribute('tabindex')) || nextFocusDisabled) {
        // Move to the next element.
        nextFocus += direction === 'next' ? 1 : -1
      } else {
        return nextFocus
      }
    }
  }

  const setHighlightedIndex = useEventCallback(
    ({
      event,
      index,
      reason = 'auto',
    }: {
      event: React.KeyboardEvent<HTMLDivElement>
      index: number
      reason?: 'auto' | 'keyboard' | 'mouse' | 'keyboard'
    }) => {
      highlightedIndexRef.current = index

      // does the index exist?
      // if (index === -1) {
      //   inputRef.current.removeAttribute('aria-activedescendant')
      // } else {
      //   inputRef.current.setAttribute('aria-activedescendant', `${id}-option-${index}`)
      // }

      // if (onHighlightChange) {
      //   onHighlightChange(event, index === -1 ? null : filteredOptions[index], reason)
      // }

      if (!listRef.current) {
        return
      }

      const prev = listRef.current.querySelector('[role="option"].Mui-focused')
      if (prev) {
        prev.classList.remove('Mui-focused')
        prev.classList.remove('Mui-focusVisible')
      }

      // const listboxNode = listRef.current.parentElement.querySelector('[role="listbox"]')
      const listboxNode = listRef.current

      // "No results"
      if (!listboxNode) {
        return
      }

      if (index === -1) {
        listboxNode.scrollTop = 0
        return
      }

      const option = listRef.current.querySelector(`[data-option-index="${index}"]`)

      if (!option) {
        return
      }

      option.classList.add('Mui-focused')
      if (reason === 'keyboard') {
        option.classList.add('Mui-focusVisible')
      }

      // Scroll active descendant into view.
      // Logic copied from https://www.w3.org/WAI/ARIA/apg/example-index/combobox/js/select-only.js
      //
      // Consider this API instead once it has a better browser support:
      // .scrollIntoView({ scrollMode: 'if-needed', block: 'nearest' });
      if (listboxNode.scrollHeight > listboxNode.clientHeight && reason !== 'mouse') {
        const element = option as HTMLLIElement

        const scrollBottom = listboxNode.clientHeight + listboxNode.scrollTop
        const elementBottom = element.offsetTop + element.offsetHeight
        if (elementBottom > scrollBottom) {
          listboxNode.scrollTop = elementBottom - listboxNode.clientHeight
        } else if (
          element.offsetTop - element.offsetHeight * (groupBy ? 1.3 : 0) <
          listboxNode.scrollTop
        ) {
          listboxNode.scrollTop = element.offsetTop - element.offsetHeight * (groupBy ? 1.3 : 0)
        }
      }
    }
  )

  const changeHighlightedIndex = useEventCallback(
    ({
      event,
      diff,
      direction = 'next',
      reason = 'auto',
    }: {
      event: React.KeyboardEvent<HTMLDivElement>
      diff: 'start' | 'end' | number
      direction?: 'next' | 'previous'
      reason?: 'auto' | 'keyboard'
    }) => {
      const getNextIndex = () => {
        const maxIndex = searchResults.length - 1

        if (diff === 'start') {
          return 0
        }

        if (diff === 'end') {
          return maxIndex
        }

        const newIndex = highlightedIndexRef.current + diff

        if (newIndex < 0) {
          if (newIndex === -1 && includeInputInList) {
            return -1
          }

          if ((disableListWrap && highlightedIndexRef.current !== -1) || Math.abs(diff) > 1) {
            return 0
          }

          return maxIndex
        }

        if (newIndex > maxIndex) {
          if (newIndex === maxIndex + 1 && includeInputInList) {
            return -1
          }

          if (disableListWrap || Math.abs(diff) > 1) {
            return maxIndex
          }

          return 0
        }

        return newIndex
      }

      const nextIndex = validOptionIndex(getNextIndex(), direction)
      setHighlightedIndex({ index: nextIndex, reason, event })
    }
  )

  useEffect(() => {
    const handler = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (openRef.current && !event.isDefaultPrevented()) {
        switch (event.key) {
          case 'Home':
            event.preventDefault()
            changeHighlightedIndex({ diff: 'start', direction: 'next', reason: 'keyboard', event })
            break
          case 'End':
            event.preventDefault()
            changeHighlightedIndex({
              diff: 'end',
              direction: 'previous',
              reason: 'keyboard',
              event,
            })
            break
          case 'PageUp':
            // event.preventDefault()
            // changeHighlightedIndex({
            //   diff: -pageSize,
            //   direction: 'previous',
            //   reason: 'keyboard',
            //   event,
            // })
            break
          case 'PageDown':
            // event.preventDefault()
            // changeHighlightedIndex({ diff: pageSize, direction: 'next', reason: 'keyboard', event })
            break
          case 'ArrowDown':
            event.preventDefault()
            changeHighlightedIndex({ diff: 1, direction: 'next', reason: 'keyboard', event })
            break
          case 'ArrowUp':
            event.preventDefault()
            changeHighlightedIndex({ diff: -1, direction: 'previous', reason: 'keyboard', event })
            break
          case 'ArrowLeft':
            break
          case 'ArrowRight':
            break
          case 'Enter':
            break
          case 'Escape':
            break
          case 'Backspace':
            break
          default:
            break
        }
      }
    }
    eventEmitter.on('onKeyDown', handler)

    return () => {
      eventEmitter.off('onKeyDown', handler)
    }
  }, [changeHighlightedIndex])

  return (
    <List
      ref={handleRef}
      style={{
        display: open ? 'block' : 'none',
        position: strategy,
        top: y ?? 0,
        left: x ?? 0,
        width: 'max-content',
      }}
      sx={{
        maxHeight: '156px',
        overflowY: 'auto',
      }}
    >
      {searchResults.map((result, index) => (
        <MenuItem
          key={result.refIndex}
          role="option"
          data-option-index={index}
          onClick={() => handleClose(result.item)}
        >
          {result.item}
        </MenuItem>
      ))}
    </List>
  )
}
