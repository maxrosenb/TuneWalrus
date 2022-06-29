import Discord from 'discord.js'
import ytdl from 'ytdl-core'
import { joinVoiceChannel } from '@discordjs/voice'
import { togglePause } from './pause'
import { Song, ServerInfo } from '../types'
import { playThroughDiscord } from '../utils/utils'
import { skip } from './skip'

const youtubesearchapi = require('youtube-search-api')

const getSong = async (userInput: string, message: Discord.Message<boolean>): Promise<Song> => {
    const songInfo: ytdl.videoInfo = await ytdl.getInfo(
        userInput.includes('https') // If the song is a url
            ? userInput // then just use the url
            : 'https://www.youtube.com/watch?v=' + // else use the youtube search api
                  (await youtubesearchapi.GetListByKeyword(userInput, false, 1).items[0].id)
    )

    return {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
        userAddedBy: message.author.username,
    }
}

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
        if (
            !message.client.user ||
            !message.guild ||
            !message.member?.voice.channel ||
            message.member?.voice.channel.permissionsFor(message.client.user) === null
        ) {
            return
        }

        if (serverInfo?.isPaused) {
            serverInfo.isPaused = false
            togglePause(message, serverInfo, false)
            return
        }

        const song: Song = await getSong(message.content.split(' ').slice(1).join(' '), message) // Get the song from the message

        if (!serverInfo) {
            // If we've never seen this server before, add it to the Map before playing the song

            serverMap.set(message.guild?.id, {
                textChannel: message.channel,
                connection: joinVoiceChannel({
                    channelId: message.member.voice.channel.id,
                    guildId: message.guild.id,
                    adapterCreator: message.guild.voiceAdapterCreator,
                    selfDeaf: false,
                }),
                songs: [song],
                volume: 5,
                isPaused: false,
            })

            playThroughDiscord(message.guild, song, serverMap)
            return
        }

        if (assertDominance) {
            message.channel.send(
                `**ASSERTING DOMINANCE**  ${
                    message.guild?.emojis?.cache.find(
                        (emoji) => emoji.name === '2434pepebusiness'
                    ) || ''
                }`
            )
            serverInfo.songs.splice(1, 0, song)
            skip(message, serverInfo, serverMap)
        } else {
            serverInfo.songs.push(song)
            message.channel.send(`${song.title} has been added to the queue!`)
        }
    } catch (error) {
        console.log(error)
    }
}
