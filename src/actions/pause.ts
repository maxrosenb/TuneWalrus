import Discord from 'discord.js'
import { ServerInfo } from '../types'
import { player } from '../utils/playThroughVoiceChannel'
import { setPaused } from '../utils/serverMap'

/**
 * Toggles the pause state of the player.
 * @param {Discord.Message} message - The Discord Message object
 * @param {ServerInfo} serverInfo - The server info object
 * @param {boolean} shouldPause - Whether or not to pause the player
 */
export const togglePause = (
    message: Discord.Message,
    serverInfo: ServerInfo | undefined,
    shouldPause: boolean = true
): void => {
    if (!serverInfo) {
        return
    }
    if (!message.member?.voice.channel) {
        message.channel.send('You have to be in a voice channel to pause the music!')
        return
    }
    if (!serverInfo) {
        message.channel.send('There is no song that I could skip!')
        return
    }
    if (message.guild?.id) {
        if (!shouldPause || serverInfo.isPaused) {
            player.unpause()
            setPaused(message.guild.id, false)
        } else {
            player.pause()
            setPaused(message.guild.id, false)
        }
    }
}
