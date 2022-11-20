import mitt from 'mitt'

type Events = {
  'open-code-picker': { inputLanguage: string }
  'close-code-picker': { selectedLanguage: string }
}

const eventEmitter = mitt<Events>()

export default eventEmitter
