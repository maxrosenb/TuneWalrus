"use strict";
exports.__esModule = true;
exports.setVolume = void 0;
var setVolume = function (serverInfo, message) {
    if (!serverInfo) {
        return;
    }
    var _a = message.content.split(" "), volume = _a[1];
    // make sure volume exists is a number between 0 and 10
    if (!volume ||
        isNaN(Number(volume)) ||
        Number(volume) < 0 ||
        Number(volume) > 10) {
        message.channel.send("Volume must be a number between 0 and 10.");
        return;
    }
    serverInfo.volume = parseInt(volume);
    message.channel.send("Volume set to " + volume);
    return;
};
exports.setVolume = setVolume;
