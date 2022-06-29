import Discord from 'discord.js'
import { joinVoiceChannel } from '@discordjs/voice'
import { togglePause } from './pause'
import { Song, ServerInfo } from '../types'
import { playThroughVC } from '../utils/playThroughVoiceChannel'
import { skip } from './skip'
import { getSongObjectFromUserInput } from '../utils/getSongObjectFromUserInput'
import { serverMap } from '../utils/serverMap'
/**
 * Play a song from the queue.
 * @param {string} Discord.Message - The Discord Message object.
 * @param {ServerInfo} serverInfo - The server info object.
 * @param {Discord.Client} client - The Discord client object.
 */
export const play = async (
    message: Discord.Message,
    serverInfo: ServerInfo | undefined,
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
        }

        const song: Song = await getSongObjectFromUserInput(
            message.content.split(' ').slice(1).join(' '),
            message.author.username
        ) // Get the song from the message

        if (!serverInfo) {
            // If we've never seen this server before, add it to the Map before playing the song

            serverMap.set(message.guild.id, {
                textChannel: message.channel,
                connection: joinVoiceChannel({
                    channelId: message.member.voice.channel.id,
                    guildId: message.guild.id,
                    adapterCreator: message.guild.voiceAdapterCreator,
                    selfDeaf: false,
                }),
                songs: [song],
                isPaused: false,
            })

            playThroughVC(message.guild, song)
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
            skip(message, serverInfo)
        } else {
            serverInfo.songs.push(song)
            if (serverInfo.songs.length === 1) {
                playThroughVC(message.guild, song)
            }
            message.channel.send(`${song.title} has been added to the queue!`)
        }
    } catch (error) {
        console.log(error)
    }
}
