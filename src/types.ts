import Discord from "discord.js";

export type Queue = Record<string, QueueConstruct>;

export type Song = {
  title: string;
  url: string;
};

export type QueueConstruct = {
  textChannel: Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel;
  voiceChannel: Discord.VoiceChannel;
  connection: Discord.VoiceConnection | null;
  songs: Song[];
  volume: number;
  playing: boolean;
};

export type ServerQueue = {
  songs: Song[];
  connection: Discord.VoiceConnection | null;
};

export type YtdlResults = { items: { id: string }[] };
