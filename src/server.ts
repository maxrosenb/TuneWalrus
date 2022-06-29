import Discord from 'discord.js'
import { client } from './utils/client'
import { PREFIX, TOKEN } from './config'
import { routeMessage } from './commands'

if (!TOKEN) {
    console.log('No token found. Please set TOKEN in config.ts')
    process.exit(1)
}

try {
    client.once('ready', (): void => {
        console.log('TuneWalrus is ready')
    })

    client.on('messageCreate', async (message: Discord.Message): Promise<void> => {
        if (message.content.startsWith(PREFIX) && !message.author.bot) {
            await routeMessage(message)
        }
    })

    client.login(TOKEN)
} catch (err) {
    console.log(err)
}
