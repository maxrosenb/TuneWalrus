import Discord from 'discord.js'
import ytdl from 'ytdl-core'
import { joinVoiceChannel } from '@discordjs/voice'
import { Song, ServerInfo } from '../types'
import { playThroughVC } from '../utils/playThroughVoiceChannel'
import { skip } from './skip'
import { togglePause } from './pause'
import { getAudioFromUrl } from '../utils/getAudioFromUrl'
import { possiblySendEmoji } from '../utils/sendEmoji'
import { serverMap } from '../utils/serverMap'

let boingSound: ytdl.videoInfo
let grocerySound: ytdl.videoInfo
let scoobySound: ytdl.videoInfo

async function getSoundInfo(url: string, author: string) {
    let songInfo: ytdl.videoInfo

    if (url === 'https://www.youtube.com/watch?v=d7vfbyFl5kc') {
        songInfo = boingSound
    }

    if (url === 'https://www.youtube.com/watch?v=GTsBU3RtF2c&t=766s') {
        songInfo = grocerySound
    }

    if (url === 'https://www.youtube.com/watch?v=xW6UWCUMhNE') {
        songInfo = scoobySound
    } else {
        songInfo = await ytdl.getInfo(url)
    }
    const song: Song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
        userAddedBy: author,
    }
    return song
}

getAudioFromUrl('https://www.youtube.com/watch?v=d7vfbyFl5kc').then((boing) => {
    boingSound = boing
})

getAudioFromUrl('https://www.youtube.com/watch?v=GTsBU3RtF2c&t=766s').then((grocery) => {
    grocerySound = grocery
})

getAudioFromUrl('https://www.youtube.com/watch?v=xW6UWCUMhNE').then((scooby) => {
    scoobySound = scooby
})

/**
 * Play a song from a url
 * @param {string} Discord.Message - The Discord Message object
 * @param {ServerInfo} serverInfo - The server info object
 * @param {Map<string, ServerInfo>} serverMap - The serverMap map
 * @param {string} url - The url to play
 */
export const playUrl = async (
    message: Discord.Message,
    serverInfo: ServerInfo | undefined,
    url: string
): Promise<void> => {
    try {
        if (serverInfo?.isPaused) {
            serverInfo.isPaused = false
            togglePause(message, serverInfo, false)
            return
        }
        possiblySendEmoji(message, '2434pepebusiness')

        if (
            !message.client.user ||
            !message.guild ||
            !message.member?.voice.channel ||
            message.member?.voice.channel.permissionsFor(message.client.user) === null
        ) {
            return
        }

        const song: Song = await getSoundInfo(url, message.author.username)

        if (!serverInfo) {
            const connection = joinVoiceChannel({
                channelId: message.member.voice.channel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
                selfDeaf: false,
            })
            // If we've never seen this server before, add it to the Map
            const serverConstruct: ServerInfo = {
                textChannel: message.channel,
                connection,
                songs: [song],
                isPaused: false,
            }

            serverMap.set(message.guild?.id, serverConstruct)
            playThroughVC(message.guild, serverConstruct.songs[0])
            return
        }

        if (serverInfo.songs.length) {
            serverInfo?.songs?.splice(1, 0, song)
            skip(message, serverInfo)
        } else {
            serverInfo.songs.push(song)
            playThroughVC(message.guild, song)
        }
    } catch (error) {
        console.log(error)
    }
}
