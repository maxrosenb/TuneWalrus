import Discord from "discord.js";
import { PREFIX, TOKEN } from "./config";
import { QueueConstruct } from "./types";
import { play } from "./actions/play";
import { stop } from "./actions/stop";
import { skip } from "./actions/skip";

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
  const queue = new Map<string, QueueConstruct>();

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
    if (
      message.author.bot ||
      !message.content.startsWith(PREFIX) ||
      !message.guild
    )
      return;

    const serverQueue = queue.get(message.guild.id);

    // PLAY COMMAND
    if (message.content.startsWith(`${PREFIX}play`)) {
      await play(message, serverQueue, queue);
      return;
    }

    // SKIP COMMAND
    if (message.content.startsWith(`${PREFIX}skip`)) {
      if (!serverQueue) {
        return;
      }
      skip(message, serverQueue);
      return;
    }

    // ASSERT DOMAIN COMMAND
    if (message.content.startsWith(`${PREFIX}assertdominance`)) {
      if (!serverQueue) {
        return;
      }
      if (serverQueue.songs.length) {
        play(message, serverQueue, queue, true);
        return;
      } else {
        play(message, serverQueue, queue, false);
      }
    }

    // STOP COMMAND
    if (message.content.startsWith(`${PREFIX}stop`)) {
      if (!serverQueue) {
        return;
      }
      stop(message, serverQueue);
      return;
    }

    // EMPTY QUEUE COMMAND
    if (message.content.startsWith(`${PREFIX}emptyqueue`)) {
      if (serverQueue) {
        serverQueue.songs = [];
      }
      const textChannel = message.channel as Discord.TextChannel;
      textChannel.send(`Queue Emptied.`);
      return;
    }

    // GOD COMMAND
    if (message.content.startsWith(`${PREFIX}god`)) {
      // get text chanel from message
      const textChannel = message.channel as Discord.TextChannel;
      textChannel.send(
        `TuneWalrus is love. TuneWalrus is life. Accept TuneWalrus into yours and live happily for the rest of your days.`
      );
      return;
    }

    // LIST QUEUE COMMAND
    if (message.content.startsWith(`${PREFIX}listqueue`)) {
      if (!serverQueue) {
        return;
      }
      const textChannel = message.channel as Discord.TextChannel;
      textChannel.send(
        `${serverQueue.songs
          .map(
            (song, index) => `${index + 1}. ${song.title} - ${song.userAddedBy}`
          )
          .join("\n")}`
      );
      return;
    }

    // SET VOLUME COMMAND
    if (message.content.startsWith(`${PREFIX}setvolume`)) {
      if (!serverQueue) {
        return;
      }

      const [, volume] = message.content.split(" ");
      // make sure volume exists is a number between 0 and 10
      if (
        !volume ||
        isNaN(Number(volume)) ||
        Number(volume) < 0 ||
        Number(volume) > 10
      ) {
        message.channel.send(`Volume must be a number between 0 and 10.`);
        return;
      }
      serverQueue.volume = parseInt(volume);

      message.channel.send(`Volume set to ${volume}`);
      return;
    }

    // HELP COMMAND
    if (message.content.startsWith(`${PREFIX}help`)) {
      const textChannel = message.channel as Discord.TextChannel;
      textChannel.send(
        `${PREFIX}play - play a song\n${PREFIX}skip - skip the current song\n${PREFIX}stop - stop the current song\n${PREFIX}emptyqueue - empty the queue\n${PREFIX}setvolume - set the volume\n${PREFIX}listqueue - list the queue\n${PREFIX}assertdominance - play the current song again\n${PREFIX}god - say TuneWalrus is love. TuneWalrus is life. Accept TuneWalrus into yours and live happily for the rest of your days.`
      );
      return;
    }

    //

    if (message.content.startsWith(`${PREFIX}ဟိုင်း`)) {
      if (!serverQueue) {
        return;
      }
      serverQueue.textChannel.send(`မင်္ဂလာပါ`);
    }
    message.channel.send("You need to enter a valid command!");
  });

  client.login(TOKEN);
} catch (err) {
  console.log(err);
}
