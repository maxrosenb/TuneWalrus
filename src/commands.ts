import Discord from 'discord.js'
import { PREFIX } from './config'
import { ServerInfo } from './types'
import { play } from './actions/play'
import { stop } from './actions/stop'
import { skip } from './actions/skip'
import { emptyQueue } from './actions/emptyQueue'
import { setVolume } from './actions/setVolume'
import { listQueue } from './actions/listQueue'
import { assertDominance } from './actions/assertDominance'
import { god } from './actions/god'
import { help } from './actions/help'
import { hello } from './actions/hello'
import { reset } from './actions/reset'
import { currentlyPlaying } from './actions/currentPlaying'
import { togglePause } from './actions/pause'
import { playUrl } from './actions/playUrl'
import { insertNext } from './actions/assertBeta'

/**
 * Routes a Discord message to the appropriate action
 * @param {Discord.Message} message - The Discord Message object
 * @param {ServerInfo | undefined} serverInfo - The server info object
 * @param {Map<string, ServerInfo>} queue - The queue map
 * @param {Discord.Client} client - The Discord Client object
 */

export const routeMessage = async (
    message: Discord.Message,
    serverInfo: ServerInfo | undefined,
    queue: Map<string, ServerInfo>,
    client: Discord.Client
): Promise<void> => {
    if (message.content.startsWith(`${PREFIX}play`)) {
        await play(message, serverInfo, queue)
    }

    if (message.content.startsWith(`${PREFIX}skip`)) {
        skip(message, serverInfo, queue)
    }

    if (
        message.content.startsWith(`${PREFIX}assertdominance`) ||
        message.content.startsWith(`${PREFIX}assert`) ||
        message.content.startsWith(`${PREFIX}ad`)
    ) {
        assertDominance(serverInfo, message, queue)
    }

    if (
        message.content.startsWith(`${PREFIX}assertbeta`) ||
        message.content.startsWith(`${PREFIX}beta`) ||
        message.content.startsWith(`${PREFIX}ab`) ||
        message.content.startsWith(`${PREFIX}next`)
    ) {
        insertNext(serverInfo, message, queue)
    }

    if (message.content.startsWith(`${PREFIX}stop`)) {
        stop(message, serverInfo, queue, client)
    }

    if (message.content.startsWith(`${PREFIX}emptyqueue`)) {
        emptyQueue(serverInfo, message)
    }

    if (message.content.startsWith(`${PREFIX}god`)) {
        god(message)
    }

    if (
        message.content.startsWith(`${PREFIX}listqueue`) ||
        message.content.startsWith(`${PREFIX}queue`) ||
        message.content.startsWith(`${PREFIX}list`)
    ) {
        listQueue(serverInfo, message)
    }

    if (message.content.startsWith(`${PREFIX}setvolume`)) {
        setVolume(serverInfo, message)
    }

    if (message.content.startsWith(`${PREFIX}help`)) {
        help(message)
    }

    if (message.content.startsWith(`${PREFIX}ဟိုင်း`)) {
        hello(message)
    }

    if (message.content.startsWith(`${PREFIX}reset`)) {
        reset(message, serverInfo, queue, client)
    }

    if (message.content.startsWith(`${PREFIX}current`)) {
        currentlyPlaying(serverInfo, message)
    }

    if (message.content.startsWith(`${PREFIX}pause`)) {
        togglePause(message, serverInfo)
    }

    if (message.content.startsWith(`${PREFIX}boing`)) {
        playUrl(message, serverInfo, queue, 'https://www.youtube.com/watch?v=d7vfbyFl5kc')
    }

    if (message.content.startsWith(`${PREFIX}grocery`)) {
        playUrl(message, serverInfo, queue, 'https://www.youtube.com/watch?v=GTsBU3RtF2c&t=766s')
    }

    if (
        message.content.startsWith(`${PREFIX}scoob`) ||
        message.content.startsWith(`${PREFIX}scooby`)
    ) {
        playUrl(message, serverInfo, queue, 'https://www.youtube.com/watch?v=xW6UWCUMhNE')
    }

    if (message.content.startsWith(`${PREFIX}party`)) {
        playUrl(message, serverInfo, queue, 'https://www.youtube.com/watch?v=N4Db0oYKXvw')
    }

    if (message.content.startsWith(`${PREFIX}death`)) {
        playUrl(message, serverInfo, queue, 'https://www.youtube.com/watch?v=9Z1IGjr2cT0')
    } else {
        message.channel.send('You need to enter a valid command!')
    }
}
