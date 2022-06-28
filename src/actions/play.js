"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.play = void 0;
var ytdl_core_1 = require("ytdl-core");
var utils_1 = require("../utils/utils");
var skip_1 = require("./skip");
var voice_1 = require("@discordjs/voice");
var pause_1 = require("./pause");
var server_1 = require("../server");
var youtubesearchapi = require("youtube-search-api");
var play = function (message, serverInfo, queue, assertDominance) {
    if (assertDominance === void 0) { assertDominance = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var songInput, linkToDownload, searchResults, songInfo, data, err_1, song, connection, serverConstruct, someEmoji;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (serverInfo === null || serverInfo === void 0 ? void 0 : serverInfo.isPaused) {
                        serverInfo.isPaused = false;
                        pause_1.togglePause(serverInfo, message, false);
                        return [2 /*return*/];
                    }
                    if (!message.client.user ||
                        !message.guild ||
                        !((_a = message.member) === null || _a === void 0 ? void 0 : _a.voice.channel) ||
                        ((_b = message.member) === null || _b === void 0 ? void 0 : _b.voice.channel.permissionsFor(message.client.user)) === null)
                        return [2 /*return*/];
                    songInput = message.content.split(" ").slice(1).join(" ");
                    if (!songInput.includes("https")) return [3 /*break*/, 1];
                    linkToDownload = songInput;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, youtubesearchapi.GetListByKeyword(songInput, false, 1)];
                case 2:
                    searchResults = _f.sent();
                    linkToDownload = "https://www.youtube.com/watch?v=" + searchResults.items[0].id;
                    _f.label = 3;
                case 3:
                    _f.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, server_1.redisClient.get(linkToDownload)];
                case 4:
                    data = _f.sent();
                    if (data) {
                        songInfo = JSON.parse(data);
                    }
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _f.sent();
                    console.log(err_1);
                    return [3 /*break*/, 6];
                case 6: return [4 /*yield*/, ytdl_core_1["default"].getInfo(linkToDownload)];
                case 7:
                    songInfo = _f.sent();
                    server_1.redisClient.set(linkToDownload, JSON.stringify(songInfo));
                    song = {
                        title: songInfo.videoDetails.title,
                        url: songInfo.videoDetails.video_url,
                        userAddedBy: message.author.username
                    };
                    if (!serverInfo) {
                        connection = voice_1.joinVoiceChannel({
                            channelId: message.member.voice.channel.id,
                            guildId: message.guild.id,
                            adapterCreator: message.guild.voiceAdapterCreator,
                            selfDeaf: false
                        });
                        serverConstruct = {
                            textChannel: message.channel,
                            connection: connection,
                            songs: [song],
                            volume: 5,
                            isPaused: false
                        };
                        queue.set((_c = message.guild) === null || _c === void 0 ? void 0 : _c.id, serverConstruct);
                        utils_1.playThroughDiscord(message.guild, serverConstruct.songs[0], queue);
                        return [2 /*return*/];
                    }
                    if (assertDominance) {
                        someEmoji = (_e = (_d = message.guild) === null || _d === void 0 ? void 0 : _d.emojis) === null || _e === void 0 ? void 0 : _e.cache.find(function (emoji) { return emoji.name === "2434pepebusiness"; });
                        message.channel.send("**ASSERTING DOMINANCE** " + ("" + (someEmoji ? someEmoji : "")));
                        serverInfo.songs.splice(1, 0, song);
                        return [2 /*return*/, skip_1.skip(message, serverInfo, queue)];
                    }
                    serverInfo.songs.push(song);
                    if (serverInfo.songs.length) {
                        utils_1.playThroughDiscord(message.guild, serverInfo.songs[0], queue);
                    }
                    message.channel.send(song.title + " has been added to the queue!");
                    return [2 /*return*/];
            }
        });
    });
};
exports.play = play;
