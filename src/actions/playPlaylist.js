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
exports.playPlaylist = void 0;
var ytdl_core_1 = require("ytdl-core");
var utils_1 = require("../utils/utils");
var youtubesearchapi = require("youtube-search-api");
var ytpl = require("ytpl");
var playPlaylist = function (message, serverInfo, queue, assertDominance) {
    if (assertDominance === void 0) { assertDominance = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var songInput, voiceChannel, playlistInfo, newSongs, serverConstruct;
        var _a;
        var _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    if (!message.client.user ||
                        !message.guild ||
                        !((_b = message.member) === null || _b === void 0 ? void 0 : _b.voice.channel) ||
                        ((_c = message.member) === null || _c === void 0 ? void 0 : _c.voice.channel.permissionsFor(message.client.user)) === null)
                        return [2 /*return*/];
                    songInput = message.content.split(" ").slice(1).join(" ");
                    voiceChannel = (_d = message.member) === null || _d === void 0 ? void 0 : _d.voice.channel;
                    if (!voiceChannel.permissionsFor(message.client.user) ||
                        !((_e = voiceChannel.permissionsFor(message.client.user)) === null || _e === void 0 ? void 0 : _e.has("CONNECT")) ||
                        !((_f = voiceChannel.permissionsFor(message.client.user)) === null || _f === void 0 ? void 0 : _f.has("SPEAK"))) {
                        message.channel.send("I need the permissions to join and speak in your voice channel!");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, ytpl(songInput)];
                case 1:
                    playlistInfo = _h.sent();
                    newSongs = playlistInfo.items.map(function (songItem) { return __awaiter(void 0, void 0, void 0, function () {
                        var songInfo;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, ytdl_core_1["default"].getInfo(songItem.shortUrl)];
                                case 1:
                                    songInfo = _a.sent();
                                    return [2 /*return*/, {
                                            title: songInfo.videoDetails.title,
                                            url: songInfo.videoDetails.video_url,
                                            userAddedBy: message.author.username
                                        }];
                            }
                        });
                    }); });
                    console.log("newSongs:");
                    console.log(newSongs);
                    if (!newSongs.length) {
                        return [2 /*return*/];
                    }
                    if (!!serverInfo) return [3 /*break*/, 3];
                    _a = {
                        textChannel: message.channel,
                        voiceChannel: voiceChannel
                    };
                    return [4 /*yield*/, voiceChannel.join()];
                case 2:
                    serverConstruct = (_a.connection = _h.sent(),
                        _a.songs = newSongs,
                        _a.volume = 5,
                        _a);
                    queue.set((_g = message.guild) === null || _g === void 0 ? void 0 : _g.id, serverConstruct);
                    utils_1.playThroughDiscord(message.guild, serverConstruct.songs[0], queue);
                    return [2 /*return*/];
                case 3:
                    serverInfo.songs = serverInfo.songs.concat(newSongs);
                    utils_1.playThroughDiscord(message.guild, serverInfo.songs[0], queue);
                    _h.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
};
exports.playPlaylist = playPlaylist;
