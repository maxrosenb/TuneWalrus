"use strict";
exports.__esModule = true;
exports.stop = void 0;
var utils_1 = require("../utils/utils");
var reset_1 = require("./reset");
var stop = function (message, serverInfo, queue, client) {
    var _a;
    if (!(serverInfo === null || serverInfo === void 0 ? void 0 : serverInfo.connection)) {
        return;
    }
    if (!((_a = message.member) === null || _a === void 0 ? void 0 : _a.voice.channel)) {
        message.channel.send("You have to be in a voice channel to stop the music!");
        return;
    }
    if (!serverInfo) {
        message.channel.send("There is no song that I could stop!");
        return;
    }
    serverInfo.songs = [];
    utils_1.player.stop();
    serverInfo.connection.disconnect();
    reset_1.reset(message, serverInfo, queue, client, false);
};
exports.stop = stop;
