import ytdl from 'ytdl-core'

export const getAudioFromUrl = async (url: string) => {
  const sound: ytdl.videoInfo = await ytdl.getInfo(url)
  return sound
}
