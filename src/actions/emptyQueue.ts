import Discord from 'discord.js'
import { ServerInfo } from '../types'

export const emptyQueue = (serverInfo: ServerInfo | undefined, message: Discord.Message): void => {
    if (serverInfo) {
        serverInfo.songs = []
    }
    const textChannel = message.channel as Discord.TextChannel
    textChannel.send('Queue Emptied.')
}
