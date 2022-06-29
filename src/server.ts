import Discord from 'discord.js'
import { PREFIX, TOKEN } from './config'
import { routeMessage } from './commands'
import { ServerInfo } from './types'

try {
    if (!TOKEN) {
        console.log('No token found. Please set TOKEN in config.ts')
        process.exit(1)
    }

    const client: Discord.Client = new Discord.Client({
        intents: [
            Discord.Intents.FLAGS.GUILDS,
            Discord.Intents.FLAGS.GUILD_MESSAGES,
            Discord.Intents.FLAGS.GUILD_VOICE_STATES,
        ],
    })

    const queue = new Map<string, ServerInfo>()

    client.once('ready', (): void => {
        console.log('Ready!')
    })

    client.on('messageCreate', async (message: Discord.Message): Promise<void> => {
        if (message.author.bot || !message.content.startsWith(PREFIX) || !message.guild) {
            return
        }
        console.log(message.content, message.author.bot)

        await routeMessage(message, queue.get(message.guild.id), queue, client)
    })

    client.login(TOKEN)
} catch (err) {
    console.log(err)
}
