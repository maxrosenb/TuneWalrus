import { ServerInfo } from '../types'

export const serverMap = new Map<string, ServerInfo>()

export const setPaused = (guildId: string, paused: boolean): void => {
    const serverInfo = serverMap.get(guildId)
    if (serverInfo) {
        serverInfo.isPaused = paused
    }
}

export const deleteQueue = (guildId: string): void => {
    const serverInfo = serverMap.get(guildId)
    if (serverInfo) {
        serverInfo.songs = []
    }
}
