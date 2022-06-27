import { ServerInfo } from "../types";
import Discord from "discord.js";

export const help = (message: Discord.Message) => {
  message.channel.send(
    "`!play` - play a song\n" +
      "`!skip` - skip the current song\n" +
      "`!stop` - stop the current song\n" +
      "`!emptyqueue` - empty the queue\n" +
      "`!listqueue` - list the queue\n" +
      "`!assertdominance` - insert song to top of queue and skip current song\n" +
      "`!current` - show the current song\n" +
      "`!reset` - **if the audio player is fucking up, try using this command to reset it**"
  );
  return;
};
