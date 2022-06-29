import Discord from 'discord.js'
import { ServerInfo } from '../types'
import { play } from './play'

export const assertDominance = (message: Discord.Message, serverInfo: ServerInfo | undefined) => {
    if (!serverInfo) {
        return
    }
    if (serverInfo.songs.length) {
        play(message, serverInfo, true)
    } else {
        play(message, serverInfo, false)
    }
}
