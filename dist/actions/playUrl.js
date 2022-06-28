import ytdl from 'ytdl-core'
import { playThroughDiscord } from '../utils/utils'
import { skip } from './skip'
import { joinVoiceChannel } from '@discordjs/voice'
import { togglePause } from './pause'
const youtubesearchapi = require('youtube-search-api')
const boingFunc = async () => {
    const boingSound = await ytdl.getInfo(
        'https://www.youtube.com/watch?v=d7vfbyFl5kc' // BOING sound
    )
    return boingSound
}
const groceryFunc = async () => {
    const grocerySound = await ytdl.getInfo(
        'https://www.youtube.com/watch?v=GTsBU3RtF2c&t=766s' // GROCERY sound
    )
    return grocerySound
}
const scoobyFunc = async () => {
    const scoobySound = await ytdl.getInfo(
        'https://www.youtube.com/watch?v=xW6UWCUMhNE' // SCOOBY sound
    )
    return scoobySound
}
let boingSound
let grocerySound
let scoobySound
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
 * @param {Map<string, ServerInfo>} queue - The queue map
 * @param {string} url - The url to play
 */
export const playUrl = async (message, serverInfo, queue, url) => {
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
        )
            return
        let songInfo
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
        const song = {
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
        serverInfo.songs.splice(1, 0, song)
        return skip(message, serverInfo, queue)
    } catch (error) {
        console.log(error)
    }
}
