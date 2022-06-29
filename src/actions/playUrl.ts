import Discord from 'discord.js'
import ytdl from 'ytdl-core'
import { joinVoiceChannel } from '@discordjs/voice'
import { Song, ServerInfo } from '../types'
import { playThroughDiscord } from '../utils/utils'
import { skip } from './skip'
import { togglePause } from './pause'

function possiblySendEmoji(
    message: Discord.Message,
    emojiName: string
): Promise<Discord.Message<boolean>> | undefined {
    return (
        message.guild?.emojis?.cache.find((emoji) => emoji.name === emojiName) &&
        message.channel.send(
            `${message.guild?.emojis?.cache.find((emoji) => emoji.name === emojiName)}`
        )
    )
}

const fetchSound = async (url: string) => {
    const sound: ytdl.videoInfo = await ytdl.getInfo(url)
    return sound
}

let boingSound: ytdl.videoInfo
let grocerySound: ytdl.videoInfo
let scoobySound: ytdl.videoInfo

async function getSong(url: string, author: string) {
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
        songInfo = await ytdl.getInfo(
            url // BOING sound
        )
    }
    const song: Song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
        userAddedBy: author,
    }
    return song
}

fetchSound('https://www.youtube.com/watch?v=d7vfbyFl5kc').then((boing) => {
    boingSound = boing
})

fetchSound('https://www.youtube.com/watch?v=GTsBU3RtF2c&t=766s').then((grocery) => {
    grocerySound = grocery
})

fetchSound('https://www.youtube.com/watch?v=xW6UWCUMhNE').then((scooby) => {
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
    serverMap: Map<string, ServerInfo>,
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

        const song: Song = await getSong(url, message.author.username)

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
                volume: 5,
                isPaused: false,
            }

            serverMap.set(message.guild?.id, serverConstruct)
            playThroughDiscord(message.guild, serverConstruct.songs[0], serverMap)
            return
        }

        if (serverInfo.songs.length) {
            serverInfo?.songs?.splice(1, 0, song)
            skip(message, serverInfo, serverMap)
        } else {
            serverInfo.songs.push(song)
            playThroughDiscord(message.guild, song, serverMap)
        }
    } catch (error) {
        console.log(error)
    }
}
