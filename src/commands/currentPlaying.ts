import Discord from 'discord.js'
import { ServerInfo } from '../types'

export const currentlyPlaying = (
  message: Discord.Message,
  serverInfo: ServerInfo | undefined
): void => {
  if (!serverInfo) {
    return
  }

  if (!serverInfo.songs || !serverInfo.songs.length) {
    message.channel.send('Nothing currently playing!')
    return
  }
  message.channel.send(
    `Currently playing: **${serverInfo.songs[0].title}** \n as requested by **${serverInfo.songs[0].userAddedBy}**`
  )
}
