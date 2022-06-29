import Discord from 'discord.js'
import ytdl from 'ytdl-core'
import { Song } from '../types'
import { serverMap } from './serverMap'

const { createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice')

export const player = createAudioPlayer()

/**
 * Play a song through a voice channe via the Discord API
 * @param {Discord.Guild} guild - The Discord Guild object
 * @param {Song} song - The song to play
 * @param {Map<string, ServerInfo>} serverMap - The serverMap map
 */

export const playThroughVC = (guild: Discord.Guild, song: Song): void => {
    const serverInfo = serverMap.get(guild.id)

    if (!serverInfo?.connection || !song?.url) {
        return
    }

    try {
        console.log(song)
        player.play(createAudioResource(ytdl(song.url)))
        player.on(AudioPlayerStatus.Idle, () => {
            // on song end
            serverInfo.songs.shift() // remove the song that just played from the queue
            if (serverInfo.songs.length === 0) {
                // If the queue is empty, stop the player and disconnect from the voice channel
                // and delete the serverInfo object from the map.
                serverInfo.connection?.disconnect()
                serverMap.delete(guild.id)
            }
            // If the queue is not empty, play the next song.
            playThroughVC(guild, serverInfo.songs[0])
        })

        serverInfo.connection.subscribe(player)
        serverInfo.textChannel.send(`Now playing: **${song.title}**`)
    } catch (err) {
        console.log(err)
    }
}
