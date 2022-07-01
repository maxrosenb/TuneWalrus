import Discord from 'discord.js'
import { createAudioResource, AudioPlayerStatus, PlayerSubscription } from '@discordjs/voice'
import ytdl from 'ytdl-core'
import { ServerInfo, Song } from '../types'
import { deleteServerInfo, serverMap, setPausedState } from './serverMap'

/**
 * Play a song through a voice channel via the Discord API
 * @param {Discord.Guild} guild - The Discord Guild object
 * @param {Song} song - The song to play
 */

export const playSongThroughVoiceAndLoopQueue = ({
  song,
  guild,
  subscription,
}: {
  guild: Discord.Guild
  song: Song
  subscription?: PlayerSubscription
}): void => {
  const { connection, songs, textChannel, serverAudioPlayer } = serverMap.get(guild.id) || {
    connection: null,
    songs: [],
    textChannel: guild.afkChannel,
  }

  if (!connection || !song?.url) {
    return
  }
  try {
    // if (subscription) {
    //   console.log('subscription found')
    //   subscription.unsubscribe()
    // }
    const sub = subscription || connection.subscribe(serverAudioPlayer)
    serverAudioPlayer.play(createAudioResource(ytdl(song.url)))
    serverAudioPlayer.on(AudioPlayerStatus.Idle, () => {
      console.log(`song finished: ${songs[0].title}`)

      // IMPORTANT: remove all listeners before removing
      // This prevents the idle status from being triggered again
      serverAudioPlayer.removeAllListeners()

      songs.shift() // remove the song that just played from the queue

      if (!songs.length) {
        // If the queue is empty, stop the serverAudioPlayer and disconnect from the voice channel
        // and delete the serverInfo object from the map.
        connection?.disconnect()
        serverAudioPlayer.stop()
        deleteServerInfo(guild.id)
        return
      }
      // If the queue is not empty, play the next song.
      playSongThroughVoiceAndLoopQueue({ guild, song: songs[0], subscription: sub })
    })
    serverAudioPlayer.on('error', (error: any) => {
      console.error(
        `Discord Player Error: ${error.message} with resource ${error.resource.metadata.title}`
      )
      serverAudioPlayer.removeAllListeners()
      // on song end
      songs.shift() // remove the song that just played from the queue
      if (!songs.length) {
        // If the queue is empty, stop the serverAudioPlayer and disconnect from the voice channel
        // and delete the serverInfo object from the map.
        connection?.disconnect()
        deleteServerInfo(guild.id)
        return
      }
      // If the queue is not empty, play the next song.
      playSongThroughVoiceAndLoopQueue({ guild, song: songs[0], subscription: sub })
    })

    textChannel.send(`Now playing: **${song.title}**`)
  } catch (error) {
    console.log(error)
  }
}

export const togglePause = (
  message: Discord.Message,
  serverInfo: ServerInfo | undefined,
  shouldPause: boolean = true
): void => {
  if (!serverInfo) {
    return
  }
  if (!message.member?.voice.channel) {
    message.channel.send('You have to be in a voice channel to pause the music!')
    return
  }
  if (!serverInfo) {
    message.channel.send('There is no song that I could skip!')
    return
  }
  if (message.guild?.id) {
    if (!shouldPause || serverInfo.isPaused) {
      serverInfo.serverAudioPlayer.unpause()
      setPausedState({ guildId: message.guild.id, newPausedState: false })
    } else {
      serverInfo.serverAudioPlayer.pause()
      setPausedState({ guildId: message.guild.id, newPausedState: false })
    }
  }
}
