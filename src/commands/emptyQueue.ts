import Discord from 'discord.js'
import { deleteQueue } from '../utils/serverMap'

export const emptyQueue = (message: Discord.Message): void => {
  if (message.guild?.id) {
    deleteQueue(message.guild.id)
  }
  const textChannel = message.channel as Discord.TextChannel
  textChannel.send('Queue Emptied.')
}
