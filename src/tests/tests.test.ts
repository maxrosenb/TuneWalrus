import Discord from 'discord.js'
import { getSongObjectFromUserInput } from '../utils/getSongObjectFromUserInput'
import { messageHandler } from '../handlers/index'
import { routeMessage } from '../routeMessage'
// import { playUrl } from '../actions/playUrl'

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

describe('Message Handler', () => {
  const message = {
    channel: {
      send: jest.fn(),
    },
    content: '',
    author: {
      bot: false,
    },
    guild: '123',
  } as unknown as Discord.Message

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('it should send God message!', async () => {
    message.content = '!god'
    await routeMessage(message)
    expect(message.channel.send).toHaveBeenCalledWith(
      'TuneWalrus is love. TuneWalrus is life. Accept TuneWalrus into yours and live happily for the rest of your days.'
    )
  })

  it('should send Help Command', async () => {
    message.content = '!help'
    await routeMessage(message)
    expect(message.channel.send).toHaveBeenCalledTimes(1)
    expect(message.channel.send).toHaveBeenCalledWith(
      '`!play`   -   play a song, or unpause music\n' +
        '`!skip`   -   skip the current song\n' +
        '`!stop`   -   stop the current song\n' +
        '`!pause`   -   pause the current song\n' +
        '`!listqueue`   -   list the queue\n' +
        '`!emptyqueue`     - empty the queue\n' +
        '`!assertdominance`   -   insert song to top of queue and skip current song\n' +
        '`!current`   -   show the current song\n' +
        '`!reset`   -   **if the audio player is fucking up, try using this command to reset it**'
    )
  })

  it('should throw an error when a bot sends a message', async () => {
    message.author.bot = true
    try {
      await routeMessage(message)
    } catch (err) {
      expect(err).toBeDefined()
      expect(message.channel.send).not.toHaveBeenCalled()
    }
  })
  it('should not call any channel.send()', async () => {
    message.author.bot = false
    message.content = '!random'
    await routeMessage(message)
    expect(message.channel.send).toHaveBeenCalledWith('Command not found')
    expect(message.channel.send).toHaveBeenCalledTimes(1)
  })
})
