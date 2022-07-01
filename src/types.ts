import Discord from 'discord.js'
import { AudioPlayer, VoiceConnection } from '@discordjs/voice'

export type Song = {
  title: string
  url: string
  userAddedBy: string
}

export type ServerInfo = {
  textChannel:
    | Discord.DMChannel
    | Discord.PartialDMChannel
    | Discord.NewsChannel
    | Discord.TextChannel
    | Discord.ThreadChannel
    | Discord.VoiceChannel
  connection: VoiceConnection | null
  songs: Song[]
  isPaused: boolean
  serverAudioPlayer: AudioPlayer
}

export type YtdlResults = { items: { id: string }[] }
