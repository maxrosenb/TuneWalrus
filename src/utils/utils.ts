import Discord from 'discord.js'
import ytdl from 'ytdl-core'
import { ServerInfo, Song } from '../types'

const { createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice')

export const player = createAudioPlayer()

/**
 * Play a song through a voice channe via the Discord API
 * @param {Discord.Guild} guild - The Discord Guild object
 * @param {Song} song - The song to play
 * @param {Map<string, ServerInfo>} queue - The queue map
 */

export const playThroughDiscord = (
    guild: Discord.Guild,
    song: Song,
    queue: Map<string, ServerInfo>
): void => {
    const serverInfo = queue.get(guild.id)

    if (!serverInfo?.connection || !song?.url) {
        return
    }

    try {
        console.log(song)
        player.play(createAudioResource(ytdl(song.url)))
        player.on(AudioPlayerStatus.Idle, () => {
            serverInfo.songs.shift()
            if (serverInfo.songs.length === 0 && serverInfo.connection) {
                serverInfo.connection.disconnect()
                queue.delete(guild.id)
            }
            playThroughDiscord(guild, serverInfo.songs[0], queue)
        })

        serverInfo.connection.subscribe(player)
        serverInfo.textChannel.send(`Now playing: **${song.title}**`)
    } catch (err) {
        console.log(err)
    }
}
