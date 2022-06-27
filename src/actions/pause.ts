import Discord from "discord.js";
import { ServerInfo } from "../types";
import { player } from "../utils/utils";
export const togglePause = (
  serverInfo: ServerInfo | undefined,
  message: Discord.Message,
  shouldPause: boolean = true
): void => {
  if (!serverInfo) {
    return;
  }
  if (!message.member?.voice.channel) {
    message.channel.send(
      "You have to be in a voice channel to pause the music!"
    );
    return;
  }
  if (!serverInfo) {
    message.channel.send("There is no song that I could skip!");
    return;
  }
  if (!shouldPause || serverInfo.isPaused) {
    player.unpause();
    serverInfo.isPaused = false;
    return;
  }
  player.pause();
  serverInfo.isPaused = true;
  return;
};
