import Discord from "discord.js";
import { ServerInfo, Song } from "../types";
import ytdl from "ytdl-core";
const {
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
} = require("@discordjs/voice");

export const player = createAudioPlayer();

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

  const resource = createAudioResource(ytdl(song.url));

  try {
    player.play(resource);

    serverInfo.connection.subscribe(player);
    player.on(AudioPlayerStatus.Idle, () => {
      serverInfo.songs.shift();
      if (serverInfo.songs.length === 0) {
        serverInfo.connection.disconnect();
      }
      playThroughDiscord(guild, serverInfo.songs[0], queue);
    });
  } catch (err) {
    console.log(err);
  }
  serverInfo.textChannel.send(`Now playing: **${song.title}**`);
};
