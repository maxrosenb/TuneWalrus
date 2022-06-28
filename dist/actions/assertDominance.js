import { play } from './play'
export const assertDominance = (serverInfo, message, queue) => {
    if (!serverInfo) {
        return
    }
    if (serverInfo.songs.length) {
        play(message, serverInfo, queue, true)
        return
    } else {
        play(message, serverInfo, queue, false)
    }
}
