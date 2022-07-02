import Discord from 'discord.js'
import { getNumSongsPlayed } from '../db/db'

export const numPlayedCommand = async (message: Discord.Message) => {
  if (!message.member) return
  const numPlayed = await getNumSongsPlayed({ discordId: message.member.id })
  message.channel.send(`**${message.author.username}** has played **${numPlayed}** songs`)
}
