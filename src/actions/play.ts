import Discord from "discord.js";
import ytdl from "ytdl-core";
import { Song, QueueConstruct, ServerQueue, YtdlResults } from "../types";
import { skip } from "./skip";
const youtubesearchapi = require("youtube-search-api");

export const play = async (
  message: Discord.Message,
  serverQueue: QueueConstruct | undefined,
  queue: Map<string, QueueConstruct>,
  assertDominance: boolean = false
) => {
  try {
    if (
      !message.client.user ||
      !message.guild ||
      !message.member?.voice.channel ||
      message.member?.voice.channel.permissionsFor(message.client.user) === null
    )
      return;

    const songInput: string = message.content.split(" ").slice(1).join(" ");
    const voiceChannel: Discord.VoiceChannel = message.member?.voice.channel;

    const permissions: Readonly<Discord.Permissions> | null =
      voiceChannel.permissionsFor(message.client.user);

    if (
      !permissions ||
      !permissions?.has("CONNECT") ||
      !permissions?.has("SPEAK")
    ) {
      return message.channel.send(
        "I need the permissions to join and speak in your voice channel!"
      );
    }

    const linkToDownload = songInput.includes("https")
      ? songInput
      : `https://www.youtube.com/watch?v=${await youtubesearchapi.GetListByKeyword(
          songInput,
          false,
          1
        ).items[0].id}`;

    console.log(`Searching song: ${songInput}`);

    const songInfo = await ytdl.getInfo(linkToDownload);

    const song: Song = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
    };

    if (!serverQueue) {
      const queueConstruct: QueueConstruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true,
      };

      queue.set(message.guild?.id, queueConstruct);

      queueConstruct.songs.push(song);

      try {
        const connection = await voiceChannel.join();
        queueConstruct.connection = connection;
        if (!message.guild) return;
        playThroughDiscord(message.guild, queueConstruct.songs[0], queue);
      } catch (err) {
        console.log(err);
        queue.delete(message.guild?.id);
        return;
      }
    } else {
      if (assertDominance) {
        console.log("Skipping!");
        serverQueue.songs.splice(1, 0, song);
        skip(message, serverQueue);

        return;
      }
      serverQueue.songs.push(song);
      return message.channel.send(`${song.title} has been added to the queue!`);
    }
  } catch (err) {
    console.log(err);
  }
};

export const playThroughDiscord = (
  guild: Discord.Guild,
  song: Song,
  queue: { get: (arg0: string) => any; delete: (arg0: string) => void }
) => {
  const serverQueue = queue.get(guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .playThroughDiscord(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      playThroughDiscord(guild, serverQueue.songs[0], queue);
    })
    .on("error", (error: any) => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

  serverQueue.textChannel.send(`Now playing: **${song.title}**`);
};
