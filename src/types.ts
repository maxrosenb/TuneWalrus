import Discord from "discord.js";

export type Song = {
  title: string;
  url: string;
  userAddedBy: string;
};

export type ServerInfo = {
  textChannel: Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel;
  voiceChannel: Discord.VoiceChannel;
  connection: Discord.VoiceConnection;
  songs: Song[];
  volume: number;
};

export type YtdlResults = { items: { id: string }[] };
