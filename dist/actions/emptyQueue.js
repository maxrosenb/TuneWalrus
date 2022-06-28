export const emptyQueue = (serverInfo, message) => {
    if (serverInfo) {
        serverInfo.songs = [];
    }
    const textChannel = message.channel;
    textChannel.send(`Queue Emptied.`);
    return;
};
