'use strict';
export const listQueue = (serverInfo, message) => {
    if (!serverInfo) {
        return;
    }
    const textChannel = message.channel;
    textChannel.send(
        `${serverInfo.songs
            .map((song, index) => `${index + 1}. ${song.title} - ${song.userAddedBy}`)
            .join('\n')}`
    );
    return;
};
