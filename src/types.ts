import Discord from "discord.js";

export type Song = {
  title: string;
  url: string;
  userAddedBy: string;
};

export type ServerInfo = {
  textChannel: Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel;
  voiceChannel: Discord.VoiceChannel;
  connection: Discord.VoiceConnection | null;
  songs: Song[];
  volume: number;
  playing: boolean;
};

export type YtdlResults = { items: { id: string }[] };
