import Discord from 'discord.js'
import { TOKEN } from './config'
import { routeMessage } from './routeMessage'
import { client } from './utils/client'

if (!TOKEN) {
  console.log(
    'No Discord API token found. Please set your token as the TOKEN environment variable in a .env file.'
  )
  process.exit(1)
}

client.once('ready', (): void => {
  console.log('TuneWalrus is ready')
})

client.on('messageCreate', async (message: Discord.Message) => {
  await routeMessage(message)
})

client.login(TOKEN)
