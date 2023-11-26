import { AudioPlayer, VoiceConnection } from '@discordjs/voice'

export type Song = {
  title: string
  url: string
  userAddedBy: string
}

export type ServerInfo = {
  textChannel: any
  connection: VoiceConnection | null
  songs: Song[]
  isPaused: boolean
  serverAudioPlayer: AudioPlayer
}

export type YtdlResults = { items: { id: string }[] }
