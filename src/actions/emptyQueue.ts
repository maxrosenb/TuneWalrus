import { ServerInfo } from "../types";
import Discord from "discord.js";

export const emptyQueue = (
  serverInfo: ServerInfo | undefined,
  message: Discord.Message
): void => {
  if (serverInfo) {
    serverInfo.songs = [];
  }
  const textChannel = message.channel as Discord.TextChannel;
  textChannel.send(`Queue Emptied.`);
  return;
};
