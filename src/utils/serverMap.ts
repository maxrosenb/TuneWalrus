import Discord from 'discord.js'
import { ServerInfo } from '../types'

export const serverMap = new Map<string, ServerInfo>()

export const getServerInfoFromMessage = (message: Discord.Message): ServerInfo | undefined =>
  serverMap.get(message?.guild?.id || '')

export const setNewServerInfo = ({
  guildId,
  serverInfo,
}: {
  guildId: string
  serverInfo: ServerInfo
}): void => {
  serverMap.set(guildId, serverInfo)
}

export const deleteServerInfo = (guildId: string): void => {
  serverMap.delete(guildId)
}

export const setPausedState = ({
  guildId,
  newPausedState,
}: {
  guildId: string
  newPausedState: boolean
}): void => {
  const serverInfo = serverMap.get(guildId)
  if (serverInfo) {
    serverInfo.isPaused = newPausedState
  }
}

export const deleteQueue = (guildId: string): void => {
  const serverInfo = serverMap.get(guildId)
  if (serverInfo) {
    serverInfo.songs = []
  }
}
