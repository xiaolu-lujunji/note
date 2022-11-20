import isHotkey from 'is-hotkey'

const HOTKEYS = {
  isSelectAll: isHotkey('mod+a'),
  isTab: isHotkey('tab'),
  isShiftTab: isHotkey('shift+tab'),
}

export default HOTKEYS
