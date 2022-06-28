import Discord from 'discord.js'
import { ServerInfo } from '../types'
import { playThroughDiscord } from '../utils/utils'

/**
 * Skip a song
 * @param {Discord.Message} message - The Discord Message object
 * @param {ServerInfo} serverInfo - The server info object
 * @param {Map<string, ServerInfo>} queue - The queue map
 */
export const skip = (
    message: Discord.Message,
    serverInfo: ServerInfo | undefined,
    queue: Map<string, ServerInfo>
): void => {
    if (!serverInfo?.connection || !message.guild) {
        return
    }
    if (!message.member?.voice.channel) {
        message.channel.send('You have to be in a voice channel to stop the music!')
        return
    }
    if (!serverInfo) {
        message.channel.send('There is no song that I could skip!')
        return
    }
    serverInfo.songs.shift()
    playThroughDiscord(message.guild, serverInfo.songs[0], queue)
}
