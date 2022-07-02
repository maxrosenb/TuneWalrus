import Discord from 'discord.js'
import { ServerInfo } from '../types'
import { play } from './play'

interface AssertDomianceArgs {
  message: Discord.Message
  serverInfo: ServerInfo | undefined
}

export const assertDominance = ({ message, serverInfo }: AssertDomianceArgs): void => {
  if (!serverInfo) {
    return
  }
  if (serverInfo.songs.length) {
    play({ message, serverInfo, assertDominance: true })
  } else {
    play({ message, serverInfo, assertDominance: false })
  }
}
