import { getSongObjectFromUserInput } from '../utils/getSongObjectFromUserInput'

test('Gets a song from user input consisting of words', async () => {
  const songObject = await getSongObjectFromUserInput({
    userInput: 'baby justin bieber',
    author: 'Max',
  })
  expect(songObject).toEqual({
    title: 'Justin Bieber - Baby (Lyrics) ft. Ludacris',
    url: 'https://www.youtube.com/watch?v=oTe_VmWuz08',
    userAddedBy: 'Max',
  })
})

test('Gets a song from user input consisting of a youtube url', async () => {
  const songObject = await getSongObjectFromUserInput({
    userInput: 'https://www.youtube.com/watch?v=GesEA9MJuII',
    author: 'Max',
  })
  expect(songObject).toEqual({
    title: 'Gaucho',
    url: 'https://www.youtube.com/watch?v=GesEA9MJuII',
    userAddedBy: 'Max',
  })
})
