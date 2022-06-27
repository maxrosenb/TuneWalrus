import Discord from "discord.js";
import ytdl from "ytdl-core";
import { Song, ServerInfo, YtdlResults } from "../types";
import { playThroughDiscord } from "../utils/utils";
import { skip } from "./skip";
const youtubesearchapi = require("youtube-search-api");
const ytpl = require("ytpl");

export const playPlaylist = async (
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

  const playlistInfo = await ytpl(songInput);
  //   console.log("playlistInfo", playlistInfo);
  //   console.log(playlistInfo);
  let newSongs: Song[] = playlistInfo.items.map(async (songItem: any) => {
    const songInfo: ytdl.videoInfo = await ytdl.getInfo(songItem.shortUrl);
    return {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
      userAddedBy: message.author.username,
    };
  });

  console.log("newSongs:");
  console.log(newSongs);

  if (!newSongs.length) {
    return;
  }

  if (!serverInfo) {
    // If we've never seen this server before, add it to the Map
    const serverConstruct: ServerInfo = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: await voiceChannel.join(),
      songs: newSongs,
      volume: 5,
    };

    queue.set(message.guild?.id, serverConstruct);
    playThroughDiscord(message.guild, serverConstruct.songs[0], queue);
    return;
  } else {
    serverInfo.songs = serverInfo.songs.concat(newSongs);
    playThroughDiscord(message.guild, serverInfo.songs[0], queue);
  }
};
