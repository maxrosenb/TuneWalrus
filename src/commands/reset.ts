import Discord from 'discord.js'
import { ServerInfo } from '../types'
import { deleteServerInfo } from '../utils/serverMap'
import { client } from '../utils/client'
/**
 * Resets the serverInfo.serverAudioPlayer if it has a problem
 * @param {Discord.Message} message - The Discord Message object
 * @param {ServerInfo} serverInfo - The server info object
 * @param {Map<string, ServerInfo>} serverMap - The serverMap map
 * @param {Discord.Client} client - The Discord client object
 * @param {boolean}} withMessage - Whether or not to send a message
 */

export const reset = async (
  message: Discord.Message,
  serverInfo: ServerInfo | undefined,
  withMessage: boolean = true
) => {
  try {
    const isValidMessage =
      message.guild &&
      message.client.user &&
      message.member?.voice?.channel?.permissionsFor(message.client.user)

    if (!isValidMessage) {
      return
    }

    serverInfo?.serverAudioPlayer.stop()
    serverInfo?.connection?.disconnect()
    deleteServerInfo(message.guild.id)

    if (withMessage) {
      message.channel.send(
        `Resetting... TuneWalrus is sorry to have failed you ${
          client.emojis.cache.find((emoji) => emoji.name === '6757_Sadge') || ''
        }`
      )
    }
  } catch (err) {
    console.log(err)
  }
}
