import Discord from 'discord.js'

export function possiblySendEmoji(
  message: Discord.Message,
  emojiName: string
): Promise<Discord.Message<boolean>> | undefined {
  return (
    message.guild?.emojis?.cache.find((emoji) => emoji.name === emojiName) &&
    message.channel.send(
      `${message.guild?.emojis?.cache.find((emoji) => emoji.name === emojiName)}`
    )
  )
}
