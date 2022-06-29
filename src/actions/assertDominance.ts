import Discord from 'discord.js'
import { ServerInfo } from '../types'
import { play } from './play'

export const assertDominance = (
    serverInfo: ServerInfo | undefined,
    message: Discord.Message,
    serverMap: Map<string, ServerInfo>
) => {
    if (!serverInfo) {
        return
    }
    if (serverInfo.songs.length) {
        play(message, serverInfo, serverMap, true)
    } else {
        play(message, serverInfo, serverMap, false)
    }
}
