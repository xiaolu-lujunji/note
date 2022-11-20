import mitt from 'mitt'

type Events = {
  onKeyDown: React.KeyboardEvent<HTMLDivElement>
}

const eventEmitter = mitt<Events>()

export default eventEmitter
