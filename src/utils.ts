import Discord from "discord.js";
import ytdl from "ytdl-core";
// @ts-ignore
import youtubesearchapi from "youtube-search-api";
import { Song, QueueConstruct, ServerQueue } from "./types";

export const execute = async (
  message: Discord.Message,
  serverQueue: QueueConstruct,
  queue: Map<any, any>,
  skipCurrent: boolean = false
) => {
  try {
    if (!message.client.user) return;
    const args = message.content.split(" ");
    const songTitle = args.slice(1).join(" ");

    const voiceChannel = message.member?.voice.channel;
    if (!voiceChannel)
      return message.channel.send(
        "You need to be in a voice channel to play music!"
      );

    const permissions = voiceChannel.permissionsFor(message.client.user);

    if (!permissions?.has("CONNECT") || !permissions?.has("SPEAK")) {
      return message.channel.send(
        "I need the permissions to join and speak in your voice channel!"
      );
    }

    const searchResults = await youtubesearchapi.GetListByKeyword(
      songTitle,
      false,
      1
    );

    const linkToSearch = songTitle.includes("https")
      ? songTitle
      : `https://www.youtube.com/watch?v=${searchResults.items[0].id}`;

    console.log(`Searching song: ${songTitle}`);

    const songInfo = await ytdl.getInfo(linkToSearch);

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
        play(message.guild, queueConstruct.songs[0], queue);
      } catch (err) {
        console.log(err);
        queue.delete(message.guild?.id);
        //@ts-ignore
        return message.channel.send(err);
      }
    } else {
      if (skipCurrent) {
        // assert dominance was called
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

export const skip = (message: Discord.Message, serverQueue: ServerQueue) => {
  if (!message.member?.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  if (!serverQueue)
    return message.channel.send("There is no song that I could skip!");
  serverQueue?.connection?.dispatcher.end();
};

export const stop = (message: Discord.Message, serverQueue: ServerQueue) => {
  if (!message.member?.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );

  if (!serverQueue)
    return message.channel.send("There is no song that I could stop!");

  serverQueue.songs = [];
  serverQueue.connection?.dispatcher?.end();
};

export const play = (
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
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0], queue);
    })
    .on("error", (error: any) => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

  serverQueue.textChannel.send(`Now playing: **${song.title}**`);
};
