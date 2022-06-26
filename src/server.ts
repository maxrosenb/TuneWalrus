import Discord from "discord.js";
import { PREFIX, TOKEN } from "./config";
import { stop, skip, execute } from "./utils";

try {
  if (!TOKEN) {
    console.log("No token found. Please set TOKEN in config.ts");
    process.exit(1);
  }

  const client = new Discord.Client({
    // @ts-ignore
    intents: [
      Discord.Intents.FLAGS.GUILDS,
      Discord.Intents.FLAGS.GUILD_MESSAGES,
    ],
  });

  // map of servers to queues
  const queue = new Map();

  client.once("ready", () => {
    console.log("Ready!");
  });

  client.once("reconnecting", () => {
    console.log("Reconnecting!");
  });

  client.once("disconnect", () => {
    console.log("Disconnect!");
  });

  client.on("message", async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;
    if (!message.guild) return;

    const serverQueue = queue.get(message.guild.id);

    if (message.content.startsWith(`${PREFIX}play`)) {
      await execute(message, serverQueue, queue);
      return;
    } else if (message.content.startsWith(`${PREFIX}skip`)) {
      skip(message, serverQueue);
      return;
    } else if (message.content.startsWith(`${PREFIX}stop`)) {
      stop(message, serverQueue);
      return;
    } else if (message.content.startsWith(`${PREFIX}god`)) {
      serverQueue.textChannel.send(
        `TuneWalrus is love. TuneWalrus is life. Accept TuneWalrus into yours and live happily for the rest of your days.`
      );
      return;
    } else {
      message.channel.send("You need to enter a valid command!");
    }
  });

  client.login(TOKEN);
} catch (err) {
  console.log(err);
}
