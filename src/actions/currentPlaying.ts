import { ServerInfo } from "../types";
import Discord from "discord.js";
export const currentlyPlaying = (
  serverInfo: ServerInfo | undefined,
  message: Discord.Message
): void => {
  if (!serverInfo) {
    return;
  }

  if (!serverInfo.songs || !serverInfo.songs.length) {
    message.channel.send("Nothing currently playing!");
    return;
  }
  message.channel.send(
    `Currently playing: **${serverInfo.songs[0].title}** \n as requested by **${serverInfo.songs[0].userAddedBy}**`
  );
};
