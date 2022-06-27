import { ServerInfo } from "../types";
import Discord from "discord.js";

export const help = (message: Discord.Message) => {
  message.channel.send(
    "`!play` - play a song\n`!skip` - skip the current song\n`!stop` - stop the current song\n`!emptyqueue` - empty the queue\n`!setvolume` - set the volume\n`!listqueue` - list the queue\n`!assertdominance` - insert song to top of queue and skip current song"
  );
  return;
};
