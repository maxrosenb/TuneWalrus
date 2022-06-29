import Discord from 'discord.js'
import ytdl from 'ytdl-core'
import { joinVoiceChannel } from '@discordjs/voice'
import { Song, ServerInfo } from '../types'
import { playThroughDiscord } from '../utils/utils'
import { skip } from './skip'
import { togglePause } from './pause'

const boingFunc = async () => {
    const boingSound: ytdl.videoInfo = await ytdl.getInfo(
        'https://www.youtube.com/watch?v=d7vfbyFl5kc' // BOING sound
    )
    return boingSound
}

const groceryFunc = async () => {
    const grocerySound: ytdl.videoInfo = await ytdl.getInfo(
        'https://www.youtube.com/watch?v=GTsBU3RtF2c&t=766s' // GROCERY sound
    )
    return grocerySound
}

const scoobyFunc = async () => {
    const scoobySound: ytdl.videoInfo = await ytdl.getInfo(
        'https://www.youtube.com/watch?v=xW6UWCUMhNE' // SCOOBY sound
    )
    return scoobySound
}

let boingSound: ytdl.videoInfo
let grocerySound: ytdl.videoInfo
let scoobySound: ytdl.videoInfo

boingFunc().then((boing) => {
    boingSound = boing
})

groceryFunc().then((grocery) => {
    grocerySound = grocery
})

scoobyFunc().then((scooby) => {
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
        const someEmoji = message.guild?.emojis?.cache.find(
            (emoji) => emoji.name === '2434pepebusiness'
        )
        if (someEmoji) {
            message.channel.send(`${someEmoji}`)
        }

        if (
            !message.client.user ||
            !message.guild ||
            !message.member?.voice.channel ||
            message.member?.voice.channel.permissionsFor(message.client.user) === null
        ) {
            return
        }

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
            userAddedBy: message.author.username,
        }

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
