import Discord from 'discord.js';
import { VoiceConnection } from '@discordjs/voice';

export type Song = {
    title: string;
    url: string;
    userAddedBy: string;
};

export type ServerInfo = {
    textChannel:
        | Discord.DMChannel
        | Discord.PartialDMChannel
        | Discord.NewsChannel
        | Discord.TextChannel
        | Discord.ThreadChannel
        | Discord.VoiceChannel;
    connection: VoiceConnection | null;
    songs: Song[];
    volume: number;
    isPaused: boolean;
};

export type YtdlResults = { items: { id: string }[] };
