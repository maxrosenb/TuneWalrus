import Discord from "discord.js";
import { ServerInfo } from "../types";
import { player } from "../utils/utils";
import { reset } from "./reset";

export const stop = (
  message: Discord.Message,
  serverInfo: ServerInfo | undefined,
  queue: Map<string, ServerInfo>,
  client: Discord.Client
): void => {
  if (!serverInfo?.connection) {
    return;
  }
  if (!message.member?.voice.channel) {
    message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
    return;
  }

  if (!serverInfo) {
    message.channel.send("There is no song that I could stop!");
    return;
  }

  serverInfo.songs = [];
  player.stop();
  serverInfo.connection.disconnect();
  reset(message, serverInfo, queue, client, false);
};
