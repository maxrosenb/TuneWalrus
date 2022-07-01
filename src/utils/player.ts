import Discord from 'discord.js'
import { createAudioResource, AudioPlayerStatus, createAudioPlayer } from '@discordjs/voice'
import ytdl from 'ytdl-core'
import { Song } from '../types'
import { deleteServerInfo, serverMap } from './serverMap'

export const player = createAudioPlayer()

/**
 * Play a song through a voice channel via the Discord API
 * @param {Discord.Guild} guild - The Discord Guild object
 * @param {Song} song - The song to play
 */

export const playSongThroughVoiceAndLoopQueue = ({
  song,
  guild,
}: {
  guild: Discord.Guild
  song: Song
}): void => {
  const { connection, songs, textChannel } = serverMap.get(guild.id) || {
    connection: null,
    songs: [],
    textChannel: guild.afkChannel,
  }

  if (!connection || !song?.url) {
    return
  }
  try {
    player.play(createAudioResource(ytdl(song.url)))
    player.on(AudioPlayerStatus.Idle, () => {
      // on song end
      songs.shift() // remove the song that just played from the queue
      if (!songs.length) {
        // If the queue is empty, stop the player and disconnect from the voice channel
        // and delete the serverInfo object from the map.
        connection?.disconnect()
        deleteServerInfo(guild.id)
        return
      }
      // If the queue is not empty, play the next song.
      playSongThroughVoiceAndLoopQueue({ guild, song: songs[0] })
    })
    connection.subscribe(player)
    textChannel.send(`Now playing: **${song.title}**`)
  } catch (error) {
    console.log(error)
  }
}
