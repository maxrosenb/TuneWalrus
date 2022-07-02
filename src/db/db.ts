/* eslint-disable quotes */
import { Pool } from 'pg'

const pool = new Pool({
  user: 'postgres',
  host: 'db',
  database: 'tunewalrusdb',
  password: 'slime',
  port: 5432,
})

export const incrementPlayCountForUser = ({
  username,
  discordId,
}: {
  username: String
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
          (err2: any, res2: any) => {
            if (err2) {
              console.log(err2)
            }
            console.log(res2)
          }
        )
      } else {
        pool.query(
          `UPDATE users SET num_songs_played = num_songs_played + 1 WHERE discord_id = '${discordId}'`,
          (err3: any, res3: any) => {
            if (err3) {
              console.log(err3)
            }
            console.log(res3)
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
  return result.rows[0].num_songs_played
}
