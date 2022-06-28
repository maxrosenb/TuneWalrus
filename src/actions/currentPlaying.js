"use strict";
exports.__esModule = true;
exports.currentlyPlaying = void 0;
var currentlyPlaying = function (serverInfo, message) {
    if (!serverInfo) {
        return;
    }
    if (!serverInfo.songs || !serverInfo.songs.length) {
        message.channel.send("Nothing currently playing!");
        return;
    }
    message.channel.send("Currently playing: **" + serverInfo.songs[0].title + "** \n as requested by **" + serverInfo.songs[0].userAddedBy + "**");
};
exports.currentlyPlaying = currentlyPlaying;
