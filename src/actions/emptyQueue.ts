import Discord from 'discord.js'
import { ServerInfo } from '../types'

export const emptyQueue = (message: Discord.Message, serverInfo: ServerInfo | undefined): void => {
    if (serverInfo) {
        serverInfo.songs = []
    }
    const textChannel = message.channel as Discord.TextChannel
    textChannel.send('Queue Emptied.')
}
