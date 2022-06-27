import Discord from "discord.js";
import { ServerInfo } from "../types";
import { player } from "../utils/utils";
const youtubesearchapi = require("youtube-search-api");

export const reset = async (
  message: Discord.Message,
  serverInfo: ServerInfo | undefined,
  queue: Map<string, ServerInfo>
): Promise<void> => {
  console.log("resetting");
  message.channel.send("Resetting... hopefully this unfucks it");
  if (
    !message.client.user ||
    !message.guild ||
    !message.member?.voice.channel ||
    !message.member?.voice.channel.permissionsFor(message.client.user) ||
    !serverInfo
  )
    return;

  player.stop();
  serverInfo.connection?.disconnect();
  serverInfo.connection = null;
  queue.delete(message.guild.id);
};
