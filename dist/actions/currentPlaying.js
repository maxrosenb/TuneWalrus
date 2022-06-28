export const currentlyPlaying = (serverInfo, message) => {
    if (!serverInfo) {
        return;
    }
    if (!serverInfo.songs || !serverInfo.songs.length) {
        message.channel.send('Nothing currently playing!');
        return;
    }
    message.channel.send(
        `Currently playing: **${serverInfo.songs[0].title}** \n as requested by **${serverInfo.songs[0].userAddedBy}**`
    );
};
