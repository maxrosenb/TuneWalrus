import { ServerInfo } from "../types";
import Discord from "discord.js";

export const listQueue = (
  serverInfo: ServerInfo | undefined,
  message: Discord.Message
) => {
  if (!serverInfo) {
    return;
  }
  const textChannel = message.channel as Discord.TextChannel;
  textChannel.send(
    `${serverInfo.songs
      .map((song, index) => `${index + 1}. ${song.title} - ${song.userAddedBy}`)
      .join("\n")}`
  );
  return;
};
