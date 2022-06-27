import { ServerInfo } from "../types";
import Discord from "discord.js";
import { play } from "./play";

export const assertDominance = (
  serverInfo: ServerInfo | undefined,
  message: Discord.Message,
  queue: Map<string, ServerInfo>
) => {
  if (!serverInfo) {
    return;
  }
  if (serverInfo.songs.length) {
    play(message, serverInfo, queue, true);
    return;
  } else {
    play(message, serverInfo, queue, false);
  }
};
