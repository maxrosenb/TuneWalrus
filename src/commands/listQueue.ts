import Discord from 'discord.js'
import { ServerInfo, Song } from '../types'

export const listQueue = (message: Discord.Message, serverInfo: ServerInfo | undefined) => {
  if (!serverInfo) {
    return
  }
  const textChannel = message.channel as Discord.TextChannel
  textChannel.send(
    `${serverInfo.songs
      .map((song: Song, index: number) => `${index + 1}. ${song.title} - ${song.userAddedBy}`)
      .join('\n')}`
  )
}
