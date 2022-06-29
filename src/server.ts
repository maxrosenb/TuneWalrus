import Discord from 'discord.js'
import { PREFIX, TOKEN } from './config'
import { routeMessage } from './commands'
import { serverMap } from './utils/serverMap'
import { client } from './utils/client'

if (!TOKEN) {
    console.log('No token found. Please set TOKEN in config.ts')
    process.exit(1)
}

try {
    client.once('ready', (): void => {
        console.log('Ready!')
    })

    client.on('messageCreate', async (message: Discord.Message): Promise<void> => {
        if (message.content.startsWith(PREFIX) && !message.author.bot && message.guild) {
            await routeMessage(message, serverMap.get(message.guild.id), serverMap, client)
        }
    })

    client.login(TOKEN)
} catch (err) {
    console.log(err)
}
