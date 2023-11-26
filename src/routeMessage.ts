import Discord from 'discord.js'
import { insertNext } from './commands/assertBeta'
import { assertDominance } from './commands/assertDominance'
import { currentlyPlaying } from './commands/currentPlaying'
import { emptyQueue } from './commands/emptyQueue'
import { god } from './commands/god'
import { help } from './commands/help'
import { listQueue } from './commands/listQueue'
import { play } from './commands/play'
import { playUrl } from './commands/playPredefinedSound'
import { reset } from './commands/reset'
import { skip } from './commands/skip'
import { stop } from './commands/stop'
import { PREFIX } from './config'
import { ServerInfo } from './types'
import { togglePause } from './utils/player'
import { getServerInfoFromMessage } from './utils/serverMap'

/**
 * Routes a Discord message to the appropriate action
 * @param {Discord.Message} message - The Discord Message object
 */
export const routeMessage = async (message: Discord.Message) => {
  if (!message.content.startsWith(PREFIX) || message.author.bot || !message.guild) {
    return
  }

  const serverInfo: ServerInfo | undefined = getServerInfoFromMessage(message)

  if (message.content.startsWith(`${PREFIX}play`)) {
    if (message.content === `${PREFIX}play`) {
      return
    }
    await play({ message, serverInfo })
    return
  }

  if (message.content.startsWith(`${PREFIX}stop`)) {
    stop({ message, serverInfo })
    return
  }

  if (message.content.startsWith(`${PREFIX}skip`)) {
    skip({ message, serverInfo })
    return
  }

  if (
    message.content.startsWith(`${PREFIX}assertdominance`) ||
    message.content.startsWith(`${PREFIX}assert`) ||
    message.content.startsWith(`${PREFIX}ad`)
  ) {
    if (
      message.content === `${PREFIX}ad` ||
      message.content === `${PREFIX}assert` ||
      message.content === `${PREFIX}assertdominance`
    ) {
      return
    }
    assertDominance({ message, serverInfo })
    return
  }

  if (
    message.content.startsWith(`${PREFIX}assertbeta`) ||
    message.content.startsWith(`${PREFIX}beta`) ||
    message.content.startsWith(`${PREFIX}ab`) ||
    message.content.startsWith(`${PREFIX}next`)
  ) {
    if (serverInfo) {
      insertNext({ message, serverInfo })
    }
    return
  }

  if (message.content.startsWith(`${PREFIX}emptyqueue`)) {
    emptyQueue(message)
    return
  }

  if (message.content === `${PREFIX}god`) {
    god(message)
    return
  }

  if (
    message.content.startsWith(`${PREFIX}listqueue`) ||
    message.content.startsWith(`${PREFIX}queue`) ||
    message.content.startsWith(`${PREFIX}list`)
  ) {
    listQueue(message, serverInfo)
    return
  }

  if (message.content.startsWith(`${PREFIX}help`)) {
    help(message)
    return
  }

  if (message.content.startsWith(`${PREFIX}reset`)) {
    reset(message, serverInfo)
    return
  }

  if (message.content.startsWith(`${PREFIX}current`)) {
    currentlyPlaying(message, serverInfo)
    return
  }

  if (message.content.startsWith(`${PREFIX}pause`)) {
    togglePause(message, serverInfo)
    return
  }

  if (message.content.startsWith(`${PREFIX}boing`)) {
    playUrl(message, serverInfo, 'https://www.youtube.com/watch?v=d7vfbyFl5kc')
    return
  }

  if (message.content.startsWith(`${PREFIX}grocery`)) {
    playUrl(message, serverInfo, 'https://www.youtube.com/watch?v=GTsBU3RtF2c&t=766s')
    return
  }

  if (
    message.content.startsWith(`${PREFIX}scoob`) ||
    message.content.startsWith(`${PREFIX}scooby`)
  ) {
    playUrl(message, serverInfo, 'https://www.youtube.com/watch?v=xW6UWCUMhNE')
    return
  }

  if (message.content.startsWith(`${PREFIX}party`)) {
    playUrl(message, serverInfo, 'https://www.youtube.com/watch?v=N4Db0oYKXvw')
    return
  }

  if (message.content.startsWith(`${PREFIX}death`)) {
    playUrl(message, serverInfo, 'https://www.youtube.com/watch?v=9Z1IGjr2cT0')
    return
  }
  message.channel.send('Command not found.')
}
