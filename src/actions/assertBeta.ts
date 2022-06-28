import { play } from "./play";
import Discord from "discord.js";
import ytdl from "ytdl-core";
import { Song, ServerInfo, YtdlResults } from "../types";
const youtubesearchapi = require("youtube-search-api");

export const assertBetaStatus = async (
  serverInfo: ServerInfo | undefined,
  message: Discord.Message,
  queue: Map<string, ServerInfo>
) => {
  if (!serverInfo) {
    return;
  }
  if (!serverInfo.songs.length) {
    play(message, serverInfo, queue, false);
    return;
  } else {
    if (
      !message.client.user ||
      !message.guild ||
      !message.member?.voice.channel ||
      message.member?.voice.channel.permissionsFor(message.client.user) === null
    )
      return;

    const songInput: string = message.content.split(" ").slice(1).join(" ");

    let linkToDownload;
    if (songInput.includes("https")) {
      linkToDownload = songInput;
    } else {
      const searchResults: YtdlResults =
        await youtubesearchapi.GetListByKeyword(songInput, false, 1);
      linkToDownload = `https://www.youtube.com/watch?v=${searchResults.items[0].id}`;
    }

    let songInfo: ytdl.videoInfo;

    songInfo = await ytdl.getInfo(linkToDownload);

    const song: Song = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
      userAddedBy: message.author.username,
    };

    serverInfo.songs.splice(1, 0, song);

    message.channel.send(
      "asserting beta status of " +
        song.userAddedBy +
        "\n will play" +
        song.title +
        " next"
    );

    return;
  }
};
