import Discord from "discord.js";
import { ServerQueue } from "../types";
export const stop = (
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
    message.channel.send("There is no song that I could stop!");
    return;
  }

  serverQueue.songs = [];
  serverQueue.connection?.dispatcher?.end();
};
