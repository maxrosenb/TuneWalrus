import Discord from 'discord.js'
import ytdl from 'ytdl-core'
import { createAudioPlayer, joinVoiceChannel } from '@discordjs/voice'
import { Song, ServerInfo } from '../types'
import { playSongThroughVoiceAndLoopQueue, togglePause } from '../utils/player'
import { skip } from './skip'
import { getAudioFromUrl } from '../utils/getAudioFromUrl'
import { possiblySendEmoji } from '../utils/sendEmoji'
import { setNewServerInfo, setPausedState } from '../utils/serverMap'

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
) => {
  const { guild, member, author, channel, client } = message

  try {
    const isValidMessage =
      client.user &&
      guild &&
      member?.voice.channel &&
      member?.voice.channel.permissionsFor(client.user)

    if (!isValidMessage) {
      return
    }

    if (serverInfo?.isPaused && guild?.id) {
      setPausedState({ guildId: guild.id, newPausedState: false })
      togglePause(message, serverInfo, false)
      return
    }
    possiblySendEmoji(message, '2434pepebusiness')

    const song: Song = await getSoundInfo(url, author.username)

    if (!serverInfo) {
      const connection = joinVoiceChannel({
        channelId: member.voice.channel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
        selfDeaf: false,
      })
      // If we've never seen this server before, add it to the Map
      const serverConstruct: ServerInfo = {
        textChannel: channel,
        connection,
        songs: [song],
        isPaused: false,
        serverAudioPlayer: createAudioPlayer(),
      }

      setNewServerInfo({ guildId: guild?.id, serverInfo: serverConstruct })
      playSongThroughVoiceAndLoopQueue({ guild, song })
      return
    }

    if (serverInfo.songs.length) {
      serverInfo?.songs?.splice(1, 0, song)
      skip({ message, serverInfo })
    } else {
      serverInfo.songs.push(song)
      playSongThroughVoiceAndLoopQueue({ guild, song })
    }
  } catch (error) {
    console.log(error)
  }
}
