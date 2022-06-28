"use strict";
exports.__esModule = true;
exports.togglePause = void 0;
var utils_1 = require("../utils/utils");
var togglePause = function (serverInfo, message, shouldPause) {
    var _a;
    if (shouldPause === void 0) { shouldPause = true; }
    if (!serverInfo) {
        return;
    }
    if (!((_a = message.member) === null || _a === void 0 ? void 0 : _a.voice.channel)) {
        message.channel.send("You have to be in a voice channel to pause the music!");
        return;
    }
    if (!serverInfo) {
        message.channel.send("There is no song that I could skip!");
        return;
    }
    if (!shouldPause || serverInfo.isPaused) {
        utils_1.player.unpause();
        serverInfo.isPaused = false;
        return;
    }
    utils_1.player.pause();
    serverInfo.isPaused = true;
    return;
};
exports.togglePause = togglePause;
