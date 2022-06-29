import Discord from 'discord.js'
import ytdl from 'ytdl-core'
import { joinVoiceChannel } from '@discordjs/voice'
import { togglePause } from './pause'
import { Song, ServerInfo, YtdlResults } from '../types'
import { playThroughDiscord } from '../utils/utils'
import { skip } from './skip'

const youtubesearchapi = require('youtube-search-api')

/**
 * Play a song from the queue.
 * @param {string} Discord.Message - The Discord Message object.
 * @param {ServerInfo} serverInfo - The server info object.
 * @param {Map<string, ServerInfo>} serverMap - The queue map.
 * @param {Discord.Client} client - The Discord client object.
 */
export const play = async (
    message: Discord.Message,
    serverInfo: ServerInfo | undefined,
    serverMap: Map<string, ServerInfo>,
    assertDominance: boolean = false
): Promise<void> => {
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
        ) {
            return
        }

        const songInput: string = message.content.split(' ').slice(1).join(' ')

        let linkToDownload
        if (songInput.includes('https')) {
            linkToDownload = songInput
        } else {
            const searchResults: YtdlResults = await youtubesearchapi.GetListByKeyword(
                songInput,
                false,
                1
            )
            linkToDownload = `https://www.youtube.com/watch?v=${searchResults.items[0].id}`
        }

        const songInfo: ytdl.videoInfo = await ytdl.getInfo(linkToDownload)

        const song: Song = {
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

            const serverConstruct: ServerInfo = {
                textChannel: message.channel,
                connection,
                songs: [song],
                volume: 5,
                isPaused: false,
            }

            serverMap.set(message.guild?.id, serverConstruct)

            playThroughDiscord(message.guild, serverConstruct.songs[0], serverMap)
            return
        }

        if (assertDominance) {
            const someEmoji = message.guild?.emojis?.cache.find(
                (emoji) => emoji.name === '2434pepebusiness'
            )
            message.channel.send(`**ASSERTING DOMINANCE**  ${someEmoji || ''}`)
            serverInfo.songs.splice(1, 0, song)
            skip(message, serverInfo, serverMap)
        } else {
            serverInfo.songs.push(song)
            message.channel.send(`${song.title} has been added to the queue!`)
        }

        return
    } catch (error) {
        console.log(error)
    }
}
