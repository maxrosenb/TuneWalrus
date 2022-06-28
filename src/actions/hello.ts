import Discord from 'discord.js'

export const hello = (message: Discord.Message) => {
    message.channel.send('မင်္ဂလာပါ')
}
