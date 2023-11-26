import ytdl from 'ytdl-core'
import { Song, YtdlResults } from '../types'

const youtubesearchapi = require('youtube-search-api')

/**
 * Get a song from user input. If the input is a youtube URL,
 * it will just use the URL, otherwise it will search for the song.
 * @param {string} userInput - The user input.
 * @param {string} author - Message author.
 * @returns {Promise<Song>} The song object.
 */
export const getSongObjectFromUserInput = ({
  userInput,
  author,
}: {
  userInput: string
  author: string
}): Promise<Song> =>
  youtubesearchapi.GetListByKeyword(userInput, false, 1).then((videoId: YtdlResults) => {
    if (videoId.items[0] !== undefined) {
      return ytdl
        .getInfo(
          userInput.includes('https')
            ? userInput
            : 'https://www.youtube.com/watch?v=' + videoId.items[0].id
        )
        .then((videoInfo: ytdl.videoInfo) => ({
          title: videoInfo.videoDetails.title,
          url: videoInfo.videoDetails.video_url,
          userAddedBy: author,
        }))
    }
    return {
      title: 'error, rickrolling you',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      userAddedBy: author,
    }
  })
