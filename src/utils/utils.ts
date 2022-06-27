import Discord from "discord.js";
import { ServerInfo, Song } from "../types";
import ytdl from "ytdl-core";

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
    serverInfo.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  try {
    const dispatcher = serverInfo.connection
      .play(ytdl(song.url))
      .on("finish", () => {
        serverInfo.songs.shift();
        playThroughDiscord(guild, serverInfo.songs[0], queue);
      })
      .on("error", (error) => console.error(error));
    dispatcher.setVolumeLogarithmic(serverInfo.volume / 5);
  } catch (err) {
    console.log(err);
  }
  serverInfo.textChannel.send(`Now playing: **${song.title}**`);
};
