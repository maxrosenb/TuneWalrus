import Discord from "discord.js";
import { Song } from "../types";
import ytdl from "ytdl-core";

export const playThroughDiscord = (
  guild: Discord.Guild,
  song: Song,
  queue: { get: (arg0: string) => any; delete: (arg0: string) => void }
): void => {
  const serverInfo = queue.get(guild.id);

  if (!song) {
    serverInfo.voiceChannel.leave();
    return queue.delete(guild.id);
  }
  try {
    const dispatcher = serverInfo.connection
      .play(ytdl(song.url))
      .on("finish", () => {
        serverInfo.songs.shift();
        playThroughDiscord(guild, serverInfo.songs[0], queue);
      })
      .on("error", (error: any) => console.error(error));
    dispatcher.setVolumeLogarithmic(serverInfo.volume / 5);
  } catch (err) {
    console.log(err);
  }
  serverInfo.textChannel.send(`Now playing: **${song.title}**`);
};
