import Discord from 'discord.js'
import { ServerInfo } from '../types'
import { playSongThroughVoiceAndLoopQueue } from '../utils/player'

/**
 * Skip a song
 * @param {Discord.Message} message - The Discord Message object
 * @param {ServerInfo} serverInfo - The server info object
 */

interface SkipArgs {
  message: Discord.Message
  serverInfo: ServerInfo | undefined
}
export const skip = ({ message, serverInfo }: SkipArgs): void => {
  const isValidMessage = serverInfo?.connection && message.guild
  if (!isValidMessage) {
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
  serverInfo.serverAudioPlayer.removeAllListeners()
  playSongThroughVoiceAndLoopQueue({ guild: message.guild, song: serverInfo.songs[0] })
}
