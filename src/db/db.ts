/* eslint-disable quotes */
import Discord from 'discord.js'
import { Pool } from 'pg'

const pool = new Pool({
  user: 'postgres',
  host: 'db',
  database: 'tunewalrusdb',
  password: 'slime',
  port: 5432,
})

const INIT_QUERY = `CREATE TABLE IF NOT EXISTS public.users (
    username character varying(25) NOT NULL,
    id uuid NOT NULL,
    num_songs_played bigint NOT NULL,
    discord_id character varying(50)
    );
    ALTER TABLE public.users OWNER TO postgres;
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

`

pool.query(INIT_QUERY, (err, res) => {
  console.log('init res:')
  console.log(res)
})

export const incrementPlayCountForUser = ({
  username,
  discordId,
}: {
  username: string
  discordId: string
}) => {
  try {
    // Check if this user exists in the db table users. If not, create the entry
    // and set the num_songs_played to 1.
    // If they do exist, increment the num_songs_played by 1.
    pool.query(`SELECT * FROM users WHERE discord_id = $1`, [discordId], (err: any, res: any) => {
      if (res?.rows.length === 0) {
        pool.query(
          `INSERT INTO users (username, id, num_songs_played, discord_id) VALUES ($1, uuid_generate_v4(), 1, $2)`,
          [username, discordId],
          (err2: any) => {
            if (err2) {
              console.log(err2)
            }
          }
        )
      } else {
        pool.query(
          `UPDATE users SET num_songs_played = num_songs_played + 1 WHERE discord_id = '${discordId}'`,
          (err3: any) => {
            if (err3) {
              console.log(err3)
            }
          }
        )
      }
    })
  } catch (error) {
    console.log(error)
  }
}

export const getNumSongsPlayed = async ({ discordId }: { discordId: string }) => {
  const result = await pool.query(`SELECT num_songs_played FROM users WHERE discord_id = $1`, [
    discordId,
  ])

  return result?.rows.length === 0 ? 0 : result.rows[0].num_songs_played
}

export const insertNewMessage = async (message: Discord.Message) => {
  // messages table columns:  id, discord_id, message_content, message_timestamp, message_guild_name
  const author = message.author.username
  const messageContent = message.content
  const guildName: string = message.guild?.name || 'unknown'

  pool.query(
    `INSERT INTO messages (id, author, content, timestamp, guild_name) VALUES (uuid_generate_v4(), $1, $2, current_timestamp, $3)`,
    [author, messageContent, guildName],
    (err: any) => {
      if (err) {
        console.log('error inserting')
        console.log(err)
      }
    }
  )
}
