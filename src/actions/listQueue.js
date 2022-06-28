"use strict";
exports.__esModule = true;
exports.listQueue = void 0;
var listQueue = function (serverInfo, message) {
    if (!serverInfo) {
        return;
    }
    var textChannel = message.channel;
    textChannel.send("" + serverInfo.songs
        .map(function (song, index) { return index + 1 + ". " + song.title + " - " + song.userAddedBy; })
        .join("\n"));
    return;
};
exports.listQueue = listQueue;
