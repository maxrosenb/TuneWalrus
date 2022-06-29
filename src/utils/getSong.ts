import ytdl from 'ytdl-core'
import { Song } from '../types'

const youtubesearchapi = require('youtube-search-api')

/**
 * Get a song from user input. If the input is a youtube URL,
 * it will just use the URL, otherwise it will search for the song.
 * @param {string} userInput - The user input.
 * @param {string} author - Message author.
 * @returns {Promise<Song>} The song object.
 */
export const getSong = async (userInput: string, author: string): Promise<Song> => {
    const x = youtubesearchapi.GetListByKeyword(userInput, false, 1).items[0].id
    const { videoDetails } = await ytdl.getInfo(
        userInput.includes('https') ? userInput : 'https://www.youtube.com/watch?v=' + x
    )
    return {
        title: videoDetails.title,
        url: videoDetails.video_url,
        userAddedBy: author,
    }
}
