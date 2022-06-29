import Discord from 'discord.js'
import ytdl from 'ytdl-core'
import { play } from './play'
import { Song, ServerInfo, YtdlResults } from '../types'

const youtubesearchapi = require('youtube-search-api')

export const insertNext = async (message: Discord.Message, serverInfo: ServerInfo | undefined) => {
    if (!serverInfo) {
        return
    }
    if (!serverInfo.songs.length) {
        play(message, serverInfo, false)
    } else {
        if (
            !message.client.user ||
            !message.guild ||
            !message.member?.voice.channel ||
            message.member?.voice.channel.permissionsFor(message.client.user) === null
        ) {
            return
        }

        const songInput: string = message.content.split(' ').slice(1).join(' ')

        let linkToDownload
        if (songInput.includes('https')) {
            linkToDownload = songInput
        } else {
            const searchResults: YtdlResults = await youtubesearchapi.GetListByKeyword(
                songInput,
                false,
                1
            )
            linkToDownload = `https://www.youtube.com/watch?v=${searchResults.items[0].id}`
        }

        const songInfo: ytdl.videoInfo = await ytdl.getInfo(linkToDownload)

        const song: Song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
            userAddedBy: message.author.username,
        }

        serverInfo.songs.splice(1, 0, song)

        message.channel.send(
            'asserting beta status of ' + song.userAddedBy + '\n will play' + song.title + ' next'
        )
    }
}
