import { createAudioPlayer, joinVoiceChannel } from '@discordjs/voice'
import Discord from 'discord.js'
import { ServerInfo, Song } from '../types'
import { getSongObjectFromUserInput } from '../utils/getSongObjectFromUserInput'
import { playSongThroughVoiceAndLoopQueue, togglePause } from '../utils/player'
import { setNewServerInfo } from '../utils/serverMap'
import { skip } from './skip'
/**
 * Play a song from the queue.
 * @param {Discord.Message} message - The Discord Message object.
 * @param {ServerInfo} serverInfo - The server info object.
 * @param {boolean} assertDominance - Whether to play this song immediately
 */
export const play = async ({
  message,
  serverInfo,
  assertDominance = false,
}: {
  message: Discord.Message
  serverInfo: ServerInfo | undefined
  assertDominance?: boolean
}) => {
  const { guild, member, author, content, channel, client } = message

  const isValidCommand =
    client.user &&
    guild &&
    member?.voice.channel &&
    member?.voice.channel.permissionsFor(client.user)

  if (!isValidCommand) {
    message.channel.send('TuneWalrus had a problem playing this song')
    return
  }

  // incrementPlayCountForUser({ username: author.username, discordId: member.id })

  const song: Song = await getSongObjectFromUserInput({
    userInput: content.split(' ').slice(1).join(' '),
    author: author.username,
  })

  if (!serverInfo) {
    setNewServerInfo({
      guildId: guild.id,
      serverInfo: {
        textChannel: channel,
        connection: joinVoiceChannel({
          channelId: member.voice.channel.id,
          guildId: guild.id,
          adapterCreator: guild.voiceAdapterCreator,
          selfDeaf: false,
        }),
        songs: [song],
        isPaused: false,
        serverAudioPlayer: createAudioPlayer(),
      },
    })
    playSongThroughVoiceAndLoopQueue({ guild, song })
  } else {
    const { isPaused, songs } = serverInfo

    if (isPaused) {
      togglePause(message, serverInfo, false)
    }

    if (assertDominance) {
      // Play song immediately
      channel.send(
        `**ASSERTING DOMINANCE**  ${
          guild?.emojis?.cache.find((emoji) => emoji.name === '2434pepebusiness') || ''
        }`
      )
      songs.splice(1, 0, song)
      skip({ message, serverInfo })
    } else {
      // Otherwise just add it to the queue
      songs.push(song)
      if (songs.length === 1) {
        playSongThroughVoiceAndLoopQueue({ guild, song })
      }
      channel.send(`${song.title} has been added to the queue!`)
    }
  }
}
