import Discord from "discord.js";
import { ServerInfo } from "../types";
import { player } from "../utils/utils";
const youtubesearchapi = require("youtube-search-api");

export const reset = async (
  message: Discord.Message,
  serverInfo: ServerInfo | undefined,
  queue: Map<string, ServerInfo>,
  client: Discord.Client,
  withMessage: boolean = true
): Promise<void> => {
  try {
    console.log("resetting");

    if (withMessage) {
      const someEmoji: Discord.GuildEmoji | undefined =
        client.emojis.cache.find((emoji) => emoji.name === "6757_Sadge");

      if (someEmoji) {
        message.channel.send(
          `Resetting... TuneWalrus is sorry to have failed you ` +
            `${someEmoji}`
        );
      } else {
        message.channel.send(
          `Resetting... TuneWalrus is sorry to have failed you `
        );
      }
    }
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
  } catch (err) {
    console.log(err);
  }
};
