<h1 align="center"> TuneWalrus <p align="center">
<img width="425" alt="Screen Shot 2022-06-26 at 6 40 52 PM" src="https://raw.githubusercontent.com/maxrosenb/tunewalrus/master/.github/images/walrus.png">
</p></h1>

## Commands

- `Play <song title>` or `Play <youtube url>`

  - Searches the song title on youtube and adds the first result to the queue, or if you pass a youtube url will just use that video
  - Examples: `play Hey Ya` or `play https://www.youtube.com/watch?v=iGx5a1ifSDs`

- `Skip`
  - Skips Song
- `Stop`
  - Stops play and deletes queue
- `emptyqueue`
  - Empties queue
- `assertdominance <song title>` or `assertdominance <youtube url>`
  - Skips current song and immediately plays this one

## Installation

`yarn install`

`ts-node src/server.ts`

