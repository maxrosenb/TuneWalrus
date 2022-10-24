import Discord from 'discord.js'
import { getLeaderBoard } from '../db/db'

export async function leaderboardCommand(message: Discord.Message<boolean>) {
  const leaderList = await getLeaderBoard()
  const leaderListAsString = leaderList.join('\n')
  message.channel.send(leaderListAsString)
}
