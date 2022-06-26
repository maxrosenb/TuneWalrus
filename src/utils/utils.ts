import Discord from "discord.js";
import { Song } from "../types";
import ytdl from "ytdl-core";

export const playThroughDiscord = (
  guild: Discord.Guild,
  song: Song,
  queue: { get: (arg0: string) => any; delete: (arg0: string) => void }
) => {
  const serverQueue = queue.get(guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }
  try {
    const dispatcher = serverQueue.connection
      .play(ytdl(song.url))
      .on("finish", () => {
        serverQueue.songs.shift();
        playThroughDiscord(guild, serverQueue.songs[0], queue);
      })
      .on("error", (error: any) => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  } catch (err) {
    console.log(err);
  }
  serverQueue.textChannel.send(`Now playing: **${song.title}**`);
};
