import Discord from 'discord.js'
import { PREFIX, TOKEN } from './config'
import { routeMessage } from './commands'
try {
    if (!TOKEN) {
        console.log('No token found. Please set TOKEN in config.ts')
        process.exit(1)
    }
    const client = new Discord.Client({
        intents: [
            Discord.Intents.FLAGS.GUILDS,
            Discord.Intents.FLAGS.GUILD_MESSAGES,
            Discord.Intents.FLAGS.GUILD_VOICE_STATES,
        ],
    })
    const queue = new Map()
    client.once('ready', () => {
        console.log('Ready!')
    })
    client.on('messageCreate', async (message) => {
        if (message.author.bot || !message.content.startsWith(PREFIX) || !message.guild) return
        await routeMessage(message, queue.get(message.guild.id), queue, client)
    })
    client.login(TOKEN)
} catch (err) {
    console.log(err)
}
