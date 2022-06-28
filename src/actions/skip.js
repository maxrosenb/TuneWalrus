"use strict";
exports.__esModule = true;
exports.skip = void 0;
var utils_1 = require("../utils/utils");
var skip = function (message, serverInfo, queue) {
    var _a;
    if (!(serverInfo === null || serverInfo === void 0 ? void 0 : serverInfo.connection) || !message.guild) {
        return;
    }
    if (!((_a = message.member) === null || _a === void 0 ? void 0 : _a.voice.channel)) {
        message.channel.send("You have to be in a voice channel to stop the music!");
        return;
    }
    if (!serverInfo) {
        message.channel.send("There is no song that I could skip!");
        return;
    }
    serverInfo.songs.shift();
    utils_1.playThroughDiscord(message.guild, serverInfo.songs[0], queue);
};
exports.skip = skip;
