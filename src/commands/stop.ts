import Discord from 'discord.js'
import { ServerInfo } from '../types'
import { reset } from './reset'

interface StopArgs {
  message: Discord.Message
  serverInfo: ServerInfo | undefined
}

export const stop = ({ message, serverInfo }: StopArgs): void => {
  if (!message.guild?.id) {
    return
  }
  if (!message.member?.voice.channel) {
    message.channel.send('You have to be in a voice channel to stop the music!')
    return
  }

  reset(message, serverInfo, false)
}
