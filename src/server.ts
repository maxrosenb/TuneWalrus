import Discord from "discord.js";
import { PREFIX, TOKEN } from "./config";
import { ServerInfo } from "./types";
import { play } from "./actions/play";
import { stop } from "./actions/stop";
import { skip } from "./actions/skip";
import { emptyQueue } from "./actions/emptyQueue";
import { setVolume } from "./actions/setVolume";
import { listQueue } from "./actions/listQueue";
import { assertDominance } from "./actions/assertDominance";
import { god } from "./actions/god";
import { help } from "./actions/help";
import { hello } from "./actions/hello";
import { playPlaylist } from "./actions/playPlaylist";
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
      Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    ],
  });

  const queue = new Map<string, ServerInfo>();

  client.once("ready", (): void => {
    console.log("Ready!");
  });

  client.on("message", async (message: Discord.Message): Promise<void> => {
    if (
      message.author.bot ||
      !message.content.startsWith(PREFIX) ||
      !message.guild
    )
      return;

    const serverInfo: ServerInfo | undefined = queue.get(message.guild.id);

    // PLAY COMMAND
    if (message.content.startsWith(`${PREFIX}play`)) {
      return await play(message, serverInfo, queue);
    }

    // PLAY PLAYLIST COMMAND
    if (message.content.startsWith(`${PREFIX}plist`)) {
      return await playPlaylist(message, serverInfo, queue, true);
    }

    // SKIP COMMAND
    if (message.content.startsWith(`${PREFIX}skip`)) {
      return skip(message, serverInfo);
    }

    // ASSERT DOMINANCE COMMAND
    if (message.content.startsWith(`${PREFIX}assertdominance`)) {
      return assertDominance(serverInfo, message, queue);
    }

    // STOP COMMAND
    if (message.content.startsWith(`${PREFIX}stop`)) {
      stop(message, serverInfo);
      return;
    }

    // EMPTY QUEUE COMMAND
    if (message.content.startsWith(`${PREFIX}emptyqueue`)) {
      return emptyQueue(serverInfo, message);
    }

    // GOD COMMAND
    if (message.content.startsWith(`${PREFIX}god`)) {
      return god(message);
    }

    // LIST QUEUE COMMAND
    if (message.content.startsWith(`${PREFIX}listqueue`)) {
      return listQueue(serverInfo, message);
    }

    // SET VOLUME COMMAND
    if (message.content.startsWith(`${PREFIX}setvolume`)) {
      return setVolume(serverInfo, message);
    }

    // HELP COMMAND
    if (message.content.startsWith(`${PREFIX}help`)) {
      return help(message);
    }

    // HELLO COMMAND
    if (message.content.startsWith(`${PREFIX}ဟိုင်း`)) {
      return hello(message);
    }

    message.channel.send("You need to enter a valid command!");
  });

  client.login(TOKEN);
} catch (err) {
  console.log(err);
}
