import ytdl from 'ytdl-core'
import { playThroughDiscord } from '../utils/utils'
import { skip } from './skip'
import { joinVoiceChannel } from '@discordjs/voice'
import { togglePause } from './pause'
const youtubesearchapi = require('youtube-search-api')
/**
 * Play a song from the queue.
 * @param {string} Discord.Message - The Discord Message object.
 * @param {ServerInfo} serverInfo - The server info object.
 * @param {Map<string, ServerInfo>} queue - The queue map.
 * @param {Discord.Client} client - The Discord client object.
 */
export const play = async (message, serverInfo, queue, assertDominance = false) => {
    try {
        if (serverInfo?.isPaused) {
            serverInfo.isPaused = false
            togglePause(message, serverInfo, false)
            return
        }
        if (
            !message.client.user ||
            !message.guild ||
            !message.member?.voice.channel ||
            message.member?.voice.channel.permissionsFor(message.client.user) === null
        )
            return
        const songInput = message.content.split(' ').slice(1).join(' ')
        let linkToDownload
        if (songInput.includes('https')) {
            linkToDownload = songInput
        } else {
            const searchResults = await youtubesearchapi.GetListByKeyword(songInput, false, 1)
            linkToDownload = `https://www.youtube.com/watch?v=${searchResults.items[0].id}`
        }
        let songInfo
        songInfo = await ytdl.getInfo(linkToDownload)
        const song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
            userAddedBy: message.author.username,
        }
        if (!serverInfo) {
            // If we've never seen this server before, add it to the Map
            const connection = joinVoiceChannel({
                channelId: message.member.voice.channel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
                selfDeaf: false,
            })
            const serverConstruct = {
                textChannel: message.channel,
                connection: connection,
                songs: [song],
                volume: 5,
                isPaused: false,
            }
            queue.set(message.guild?.id, serverConstruct)
            playThroughDiscord(message.guild, serverConstruct.songs[0], queue)
            return
        }
        if (assertDominance) {
            const someEmoji = message.guild?.emojis?.cache.find(
                (emoji) => emoji.name === '2434pepebusiness'
            )
            message.channel.send('**ASSERTING DOMINANCE** ' + `${someEmoji ? someEmoji : ''}`)
            serverInfo.songs.splice(1, 0, song)
            return skip(message, serverInfo, queue)
        }
        serverInfo.songs.push(song)
        playThroughDiscord(message.guild, serverInfo.songs[0], queue)
        message.channel.send(`${song.title} has been added to the queue!`)
        return
    } catch (error) {
        console.log(error)
    }
}
