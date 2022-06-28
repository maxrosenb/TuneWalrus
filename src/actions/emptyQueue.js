"use strict";
exports.__esModule = true;
exports.emptyQueue = void 0;
var emptyQueue = function (serverInfo, message) {
    if (serverInfo) {
        serverInfo.songs = [];
    }
    var textChannel = message.channel;
    textChannel.send("Queue Emptied.");
    return;
};
exports.emptyQueue = emptyQueue;
