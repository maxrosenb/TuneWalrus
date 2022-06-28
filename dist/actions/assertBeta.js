import { play } from './play';
import ytdl from 'ytdl-core';
const youtubesearchapi = require('youtube-search-api');
export const insertNext = async (serverInfo, message, queue) => {
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
        const songInput = message.content.split(' ').slice(1).join(' ');
        let linkToDownload;
        if (songInput.includes('https')) {
            linkToDownload = songInput;
        } else {
            const searchResults = await youtubesearchapi.GetListByKeyword(songInput, false, 1);
            linkToDownload = `https://www.youtube.com/watch?v=${searchResults.items[0].id}`;
        }
        let songInfo;
        songInfo = await ytdl.getInfo(linkToDownload);
        const song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
            userAddedBy: message.author.username,
        };
        serverInfo.songs.splice(1, 0, song);
        message.channel.send(
            'asserting beta status of ' + song.userAddedBy + '\n will play' + song.title + ' next'
        );
        return;
    }
};
