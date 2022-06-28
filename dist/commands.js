import { PREFIX } from './config';
import { play } from './actions/play';
import { stop } from './actions/stop';
import { skip } from './actions/skip';
import { emptyQueue } from './actions/emptyQueue';
import { setVolume } from './actions/setVolume';
import { listQueue } from './actions/listQueue';
import { assertDominance } from './actions/assertDominance';
import { god } from './actions/god';
import { help } from './actions/help';
import { hello } from './actions/hello';
import { reset } from './actions/reset';
import { currentlyPlaying } from './actions/currentPlaying';
import { togglePause } from './actions/pause';
import { playUrl } from './actions/playUrl';
import { insertNext } from './actions/assertBeta';
/**
 * Routes a Discord message to the appropriate action
 * @param {Discord.Message} message - The Discord Message object
 * @param {ServerInfo | undefined} serverInfo - The server info object
 * @param {Map<string, ServerInfo>} queue - The queue map
 * @param {Discord.Client} client - The Discord Client object
 */
export const routeMessage = async (message, serverInfo, queue, client) => {
    if (message.content.startsWith(`${PREFIX}play`)) {
        return await play(message, serverInfo, queue);
    }
    if (message.content.startsWith(`${PREFIX}skip`)) {
        return skip(message, serverInfo, queue);
    }
    if (
        message.content.startsWith(`${PREFIX}assertdominance`) ||
        message.content.startsWith(`${PREFIX}assert`) ||
        message.content.startsWith(`${PREFIX}ad`)
    ) {
        return assertDominance(serverInfo, message, queue);
    }
    if (
        message.content.startsWith(`${PREFIX}assertbeta`) ||
        message.content.startsWith(`${PREFIX}beta`) ||
        message.content.startsWith(`${PREFIX}ab`) ||
        message.content.startsWith(`${PREFIX}next`)
    ) {
        return insertNext(serverInfo, message, queue);
    }
    if (message.content.startsWith(`${PREFIX}stop`)) {
        stop(message, serverInfo, queue, client);
        return;
    }
    if (message.content.startsWith(`${PREFIX}emptyqueue`)) {
        return emptyQueue(serverInfo, message);
    }
    if (message.content.startsWith(`${PREFIX}god`)) {
        return god(message);
    }
    if (
        message.content.startsWith(`${PREFIX}listqueue`) ||
        message.content.startsWith(`${PREFIX}queue`) ||
        message.content.startsWith(`${PREFIX}list`)
    ) {
        return listQueue(serverInfo, message);
    }
    if (message.content.startsWith(`${PREFIX}setvolume`)) {
        return setVolume(serverInfo, message);
    }
    if (message.content.startsWith(`${PREFIX}help`)) {
        return help(message);
    }
    if (message.content.startsWith(`${PREFIX}ဟိုင်း`)) {
        return hello(message);
    }
    if (message.content.startsWith(`${PREFIX}reset`)) {
        return reset(message, serverInfo, queue, client);
    }
    if (message.content.startsWith(`${PREFIX}current`)) {
        return currentlyPlaying(serverInfo, message);
    }
    if (message.content.startsWith(`${PREFIX}pause`)) {
        return togglePause(message, serverInfo);
    }
    if (message.content.startsWith(`${PREFIX}boing`)) {
        return playUrl(message, serverInfo, queue, 'https://www.youtube.com/watch?v=d7vfbyFl5kc');
    }
    if (message.content.startsWith(`${PREFIX}grocery`)) {
        return playUrl(
            message,
            serverInfo,
            queue,
            'https://www.youtube.com/watch?v=GTsBU3RtF2c&t=766s'
        );
    }
    if (
        message.content.startsWith(`${PREFIX}scoob`) ||
        message.content.startsWith(`${PREFIX}scooby`)
    ) {
        return playUrl(message, serverInfo, queue, 'https://www.youtube.com/watch?v=xW6UWCUMhNE');
    }
    if (message.content.startsWith(`${PREFIX}party`)) {
        return playUrl(message, serverInfo, queue, 'https://www.youtube.com/watch?v=N4Db0oYKXvw');
    }
    if (message.content.startsWith(`${PREFIX}death`)) {
        return playUrl(message, serverInfo, queue, 'https://www.youtube.com/watch?v=9Z1IGjr2cT0');
    } else {
        message.channel.send('You need to enter a valid command!');
    }
};
