import { player } from '../utils/utils';
const youtubesearchapi = require('youtube-search-api');
/**
 * Resets the player if it has a problem
 * @param {Discord.Message} message - The Discord Message object
 * @param {ServerInfo} serverInfo - The server info object
 * @param {queue} Map<string, ServerInfo> - The queue map
 * @param {client} Discord.Client - The Discord client object
 * @param {boolean}} withMessage - Whether or not to send a message
 */
export const reset = async (message, serverInfo, queue, client, withMessage = true) => {
    try {
        console.log('resetting');
        if (withMessage) {
            const someEmoji = client.emojis.cache.find((emoji) => emoji.name === '6757_Sadge');
            if (someEmoji) {
                message.channel.send(
                    `Resetting... TuneWalrus is sorry to have failed you ` + `${someEmoji}`
                );
            } else {
                message.channel.send(`Resetting... TuneWalrus is sorry to have failed you `);
            }
        }
        if (
            !message.client.user ||
            !message.guild ||
            !message.member?.voice.channel ||
            !message.member?.voice.channel.permissionsFor(message.client.user) ||
            !serverInfo
        )
            return;
        player.stop();
        serverInfo.connection?.disconnect();
        serverInfo.connection = null;
        queue.delete(message.guild.id);
    } catch (err) {
        console.log(err);
    }
};
