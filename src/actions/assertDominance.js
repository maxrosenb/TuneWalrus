"use strict";
exports.__esModule = true;
exports.assertDominance = void 0;
var play_1 = require("./play");
var assertDominance = function (serverInfo, message, queue) {
    if (!serverInfo) {
        return;
    }
    if (serverInfo.songs.length) {
        play_1.play(message, serverInfo, queue, true);
        return;
    }
    else {
        play_1.play(message, serverInfo, queue, false);
    }
};
exports.assertDominance = assertDominance;
