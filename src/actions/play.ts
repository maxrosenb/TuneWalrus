import Discord from "discord.js";
import ytdl from "ytdl-core";
import { Song, ServerInfo, YtdlResults } from "../types";
import { playThroughDiscord } from "../utils/utils";
import { skip } from "./skip";
const youtubesearchapi = require("youtube-search-api");

export const play = async (
  message: Discord.Message,
  serverInfo: ServerInfo | undefined,
  queue: Map<string, ServerInfo>,
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

  let linkToDownload;
  if (songInput.includes("https")) {
    linkToDownload = songInput;
  } else {
    const searchResults: YtdlResults = await youtubesearchapi.GetListByKeyword(
      songInput,
      false,
      1
    );
    linkToDownload = `https://www.youtube.com/watch?v=${searchResults.items[0].id}`;
  }

  const songInfo: ytdl.videoInfo = await ytdl.getInfo(linkToDownload);

  const song: Song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
    userAddedBy: message.author.username,
  };

  if (!serverInfo) {
    // If we've never seen this server before, add it to the Map
    const serverConstruct: ServerInfo = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: await voiceChannel.join(),
      songs: [song],
      volume: 5,
    };

    queue.set(message.guild?.id, serverConstruct);
    playThroughDiscord(message.guild, serverConstruct.songs[0], queue);
    return;
  }

  if (assertDominance) {
    serverInfo.songs.splice(1, 0, song);
    return skip(message, serverInfo);
  }

  serverInfo.songs.push(song);
  message.channel.send(`${song.title} has been added to the queue!`);
  return;
};
