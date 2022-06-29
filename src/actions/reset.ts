import Discord from 'discord.js'
import { ServerInfo } from '../types'
import { player } from '../utils/utils'

/**
 * Resets the player if it has a problem
 * @param {Discord.Message} message - The Discord Message object
 * @param {ServerInfo} serverInfo - The server info object
 * @param {Map<string, ServerInfo>} serverMap - The serverMap map
 * @param {Discord.Client} client - The Discord client object
 * @param {boolean}} withMessage - Whether or not to send a message
 */

export const reset = async (
    message: Discord.Message,
    serverInfo: ServerInfo | undefined,
    serverMap: Map<string, ServerInfo>,
    client: Discord.Client,
    withMessage: boolean = true
): Promise<void> => {
    try {
        console.log('resetting')
        if (
            !message.client.user ||
            !message.guild ||
            !message.member?.voice.channel ||
            !message.member?.voice.channel.permissionsFor(message.client.user) ||
            !serverInfo
        ) {
            return
        }

        if (withMessage) {
            const someEmoji: Discord.GuildEmoji | undefined = client.emojis.cache.find(
                (emoji) => emoji.name === '6757_Sadge'
            )

            if (someEmoji) {
                message.channel.send(
                    `Resetting... TuneWalrus is sorry to have failed you ${someEmoji}`
                )
            } else {
                message.channel.send('Resetting... TuneWalrus is sorry to have failed you')
            }
        }

        player.stop()
        serverInfo.connection?.disconnect()
        serverInfo.connection = null
        serverMap.delete(message.guild.id)
    } catch (err) {
        console.log(err)
    }
}
