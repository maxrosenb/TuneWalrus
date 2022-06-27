import Discord from "discord.js";
import ytdl from "ytdl-core";
import { Song, ServerInfo, YtdlResults } from "../types";
import { playThroughDiscord } from "../utils/utils";
import { skip } from "./skip";
import { player } from "../utils/utils";
import { joinVoiceChannel } from "@discordjs/voice";

const youtubesearchapi = require("youtube-search-api");

export const reset = async (
  message: Discord.Message,
  serverInfo: ServerInfo | undefined,
  queue: Map<string, ServerInfo>
): Promise<void> => {
  console.log("resetting");
  message.channel.send("Resetting... hopefully this unfucks it");
  if (
    !message.client.user ||
    !message.guild ||
    !message.member?.voice.channel ||
    message.member?.voice.channel.permissionsFor(message.client.user) ===
      null ||
    !serverInfo
  )
    return;

  player.stop();

  const connection = joinVoiceChannel({
    channelId: message.member.voice.channel.id,
    guildId: message.guild.id,
    adapterCreator: message.guild.voiceAdapterCreator,
    selfDeaf: false,
  });

  connection.disconnect;

  const serverConstruct: ServerInfo = {
    textChannel: message.channel,
    connection: connection,
    songs: [],
    volume: 5,
  };
  queue.delete(message.guild.id);
  queue.set(message.guild.id, serverConstruct);
};
