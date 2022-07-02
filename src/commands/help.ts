import Discord from 'discord.js'

export const help = (message: Discord.Message) => {
  message.channel.send(
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
}
