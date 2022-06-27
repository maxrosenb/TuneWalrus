import Discord from "discord.js";
import { ServerQueue } from "../types";

export const skip = (
  message: Discord.Message,
  serverQueue: ServerQueue
): void => {
  if (!message.member?.voice.channel) {
    message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
    return;
  }
  if (!serverQueue) {
    message.channel.send("There is no song that I could skip!");
    return;
  }
  serverQueue?.connection?.dispatcher.end();
};
