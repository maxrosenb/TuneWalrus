"use strict";
exports.__esModule = true;
exports.playThroughDiscord = exports.player = void 0;
var ytdl_core_1 = require("ytdl-core");
var _a = require("@discordjs/voice"), createAudioPlayer = _a.createAudioPlayer, createAudioResource = _a.createAudioResource, AudioPlayerStatus = _a.AudioPlayerStatus;
exports.player = createAudioPlayer();
var playThroughDiscord = function (guild, song, queue) {
    var serverInfo = queue.get(guild.id);
    if (!(serverInfo === null || serverInfo === void 0 ? void 0 : serverInfo.connection)) {
        return;
    }
    if (!serverInfo) {
        return;
    }
    if (!song) {
        queue["delete"](guild.id);
        return;
    }
    var resource = createAudioResource(ytdl_core_1["default"](song.url));
    try {
        exports.player.play(resource);
        serverInfo.connection.subscribe(exports.player);
        exports.player.on(AudioPlayerStatus.Idle, function () {
            var _a;
            serverInfo.songs.shift();
            if (serverInfo.songs.length === 0) {
                (_a = serverInfo.connection) === null || _a === void 0 ? void 0 : _a.disconnect();
            }
            exports.playThroughDiscord(guild, serverInfo.songs[0], queue);
        });
    }
    catch (err) {
        console.log(err);
    }
    serverInfo.textChannel.send("Now playing: **" + song.title + "**");
};
exports.playThroughDiscord = playThroughDiscord;
