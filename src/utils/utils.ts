import Discord from "discord.js";
import { ServerInfo, Song } from "../types";
import ytdl from "ytdl-core";
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
} = require("@discordjs/voice");

export const playThroughDiscord = (
  guild: Discord.Guild,
  song: Song,
  queue: Map<string, ServerInfo>
): void => {
  const serverInfo = queue.get(guild.id);

  if (!serverInfo) {
    return;
  }

  if (!song) {
    queue.delete(guild.id);
    return;
  }

  const player = createAudioPlayer();
  const resource = createAudioResource(ytdl(song.url));

  try {
    player.play(resource);
    serverInfo.connection.subscribe(player);
    player.on("finish", () => {
      serverInfo.songs.shift();
      playThroughDiscord(guild, serverInfo.songs[0], queue);
    });
    player.on("error", (error: any) => console.error(error));
  } catch (err) {
    console.log(err);
  }
  serverInfo.textChannel.send(`Now playing: **${song.title}**`);
};
