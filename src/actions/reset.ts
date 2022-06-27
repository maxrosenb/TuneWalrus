import Discord from "discord.js";
import ytdl from "ytdl-core";
import { Song, ServerInfo, YtdlResults } from "../types";
import { playThroughDiscord } from "../utils/utils";
import { skip } from "./skip";
import { joinVoiceChannel } from "@discordjs/voice";

const youtubesearchapi = require("youtube-search-api");

export const reset = async (
  message: Discord.Message,
  serverInfo: ServerInfo | undefined
): Promise<void> => {
  console.log("resetting");
  if (
    !message.client.user ||
    !message.guild ||
    !message.member?.voice.channel ||
    message.member?.voice.channel.permissionsFor(message.client.user) ===
      null ||
    !serverInfo
  )
    return;

  serverInfo.connection.disconnect();

  serverInfo.connection = joinVoiceChannel({
    channelId: message.member.voice.channel.id,
    guildId: message.guild.id,
    adapterCreator: message.guild.voiceAdapterCreator,
    selfDeaf: false,
  });
};
