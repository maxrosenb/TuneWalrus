import Discord from "discord.js";
import ytdl from "ytdl-core";
import { Song, ServerInfo, YtdlResults } from "../types";
import { playThroughDiscord } from "../utils/utils";
import { skip } from "./skip";
import { joinVoiceChannel } from "@discordjs/voice";
import { togglePause } from "./pause";
const youtubesearchapi = require("youtube-search-api");

const boingFunc = async () => {
  const boingSound: ytdl.videoInfo = await ytdl.getInfo(
    "https://www.youtube.com/watch?v=d7vfbyFl5kc" // BOING sound
  );
  return boingSound;
};

let boingSound: ytdl.videoInfo;

boingFunc().then((boing) => {
  boingSound = boing;
});

export const playUrl = async (
  message: Discord.Message,
  serverInfo: ServerInfo | undefined,
  queue: Map<string, ServerInfo>,
  url: string,
  assertDominance: boolean = false
): Promise<void> => {
  if (serverInfo?.isPaused) {
    serverInfo.isPaused = false;
    togglePause(serverInfo, message, false);
    return;
  }
  const someEmoji = message.guild?.emojis?.cache.find(
    (emoji) => emoji.name === "2434pepebusiness"
  );
  if (someEmoji) {
    message.channel.send(`${someEmoji}`);
  }

  if (
    !message.client.user ||
    !message.guild ||
    !message.member?.voice.channel ||
    message.member?.voice.channel.permissionsFor(message.client.user) === null
  )
    return;

  let songInfo: ytdl.videoInfo;

  if (url === "https://www.youtube.com/watch?v=d7vfbyFl5kc") {
    songInfo = boingSound;
  } else {
    songInfo = await ytdl.getInfo(
      url // BOING sound
    );
  }

  const song: Song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
    userAddedBy: message.author.username,
  };

  if (!serverInfo) {
    const connection = joinVoiceChannel({
      channelId: message.member.voice.channel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
      selfDeaf: false,
    });
    // If we've never seen this server before, add it to the Map
    const serverConstruct: ServerInfo = {
      textChannel: message.channel,
      connection: connection,
      songs: [song],
      volume: 5,
      isPaused: false,
    };

    queue.set(message.guild?.id, serverConstruct);
    playThroughDiscord(message.guild, serverConstruct.songs[0], queue);
    return;
  }

  serverInfo.songs.splice(1, 0, song);
  return skip(message, serverInfo, queue);
};
