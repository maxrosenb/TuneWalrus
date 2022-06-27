import Discord from "discord.js";
import ytdl from "ytdl-core";
import { Song, QueueConstruct, ServerQueue, YtdlResults } from "../types";
import { playThroughDiscord } from "../utils/utils";
import { skip } from "./skip";
const youtubesearchapi = require("youtube-search-api");

export const play = async (
  message: Discord.Message,
  serverQueue: QueueConstruct | undefined,
  queue: Map<string, QueueConstruct>,
  assertDominance: boolean = false
): Promise<void> => {
  if (
    !message.client.user ||
    !message.guild ||
    !message.member?.voice.channel ||
    message.member?.voice.channel.permissionsFor(message.client.user) === null
  )
    return;

  const songInput: string = message.content.split(" ").slice(1).join(" ");
  const voiceChannel: Discord.VoiceChannel = message.member?.voice.channel;

  if (
    !voiceChannel.permissionsFor(message.client.user) ||
    !voiceChannel.permissionsFor(message.client.user)?.has("CONNECT") ||
    !voiceChannel.permissionsFor(message.client.user)?.has("SPEAK")
  ) {
    message.channel.send(
      "I need the permissions to join and speak in your voice channel!"
    );
    return;
  }

  const searchResults: YtdlResults = await youtubesearchapi.GetListByKeyword(
    songInput,
    false,
    1
  );

  const linkToDownload = songInput.includes("https")
    ? songInput
    : `https://www.youtube.com/watch?v=${searchResults.items[0].id}`;

  const songInfo: ytdl.videoInfo = await ytdl.getInfo(linkToDownload);

  const song: Song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
    userAddedBy: message.author.username,
  };

  if (!serverQueue) {
    // If we've never seen this server before, add it to the Map

    const queueConstruct: QueueConstruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: await voiceChannel.join(),
      songs: [song],
      volume: 5,
      playing: true,
    };

    queue.set(message.guild?.id, queueConstruct);
    playThroughDiscord(message.guild, queueConstruct.songs[0], queue);
    return;
  }

  // otherwise just play the song, asserting dominance if needed

  if (assertDominance) {
    serverQueue.songs.splice(1, 0, song);
    skip(message, serverQueue);
    return;
  }

  serverQueue.songs.push(song);
  message.channel.send(`${song.title} has been added to the queue!`);
  return;
};
