<h1 align="center"> TuneWalrus <p align="center">
<img width="425" alt="Screen Shot 2022-06-26 at 6 40 52 PM" src="https://user-images.githubusercontent.com/35173688/175836460-3d46b471-b7f0-4b80-b8ee-50f1f2ef3651.png">
</p></h1>

## Commands

-   `Play <song title>` or `Play <youtube url>`

    -   Searches the song title on youtube and adds the first result to the queue, or if you pass a youtube url will just use that video
    -   Examples: `play Hey Ya` or `play https://www.youtube.com/watch?v=iGx5a1ifSDs`

-   `Skip`
    -   Skips Song
-   `Stop`
    -   Stops play and deletes queue
-   `emptyqueue`
    -   Empties queue
-   `assertdominance <song title>` or `assertdominance <youtube url>`
    -   Skips current song and immediately plays this one

## Installation

`npm install`

`ts-node --transpile-only src/server.ts`

still a few tiny TS things to be fixed, hence --transpile-only
