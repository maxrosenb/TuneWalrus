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
exports.redisClient = void 0;
var discord_js_1 = require("discord.js");
var config_1 = require("./config");
var play_1 = require("./actions/play");
var stop_1 = require("./actions/stop");
var skip_1 = require("./actions/skip");
var emptyQueue_1 = require("./actions/emptyQueue");
var setVolume_1 = require("./actions/setVolume");
var listQueue_1 = require("./actions/listQueue");
var assertDominance_1 = require("./actions/assertDominance");
var god_1 = require("./actions/god");
var help_1 = require("./actions/help");
var hello_1 = require("./actions/hello");
var playPlaylist_1 = require("./actions/playPlaylist");
var reset_1 = require("./actions/reset");
var currentPlaying_1 = require("./actions/currentPlaying");
var pause_1 = require("./actions/pause");
var playUrl_1 = require("./actions/playUrl");
var redis_1 = require("redis");
exports.redisClient = redis_1.createClient();
exports.redisClient.on("error", function (err) {
    console.log("Error " + err);
});
var connectRedis = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.redisClient.connect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
connectRedis();
try {
    if (!config_1.TOKEN) {
        console.log("No token found. Please set TOKEN in config.ts");
        process.exit(1);
    }
    var client_1 = new discord_js_1["default"].Client({
        // @ts-ignore
        intents: [
            discord_js_1["default"].Intents.FLAGS.GUILDS,
            discord_js_1["default"].Intents.FLAGS.GUILD_MESSAGES,
            discord_js_1["default"].Intents.FLAGS.GUILD_VOICE_STATES,
        ]
    });
    var queue_1 = new Map();
    client_1.once("ready", function () {
        console.log("Ready!");
    });
    client_1.on("message", function (message) { return __awaiter(void 0, void 0, void 0, function () {
        var serverInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (message.author.bot ||
                        !message.content.startsWith(config_1.PREFIX) ||
                        !message.guild)
                        return [2 /*return*/];
                    serverInfo = queue_1.get(message.guild.id);
                    if (!message.content.startsWith(config_1.PREFIX + "play")) return [3 /*break*/, 2];
                    return [4 /*yield*/, play_1.play(message, serverInfo, queue_1)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    if (!message.content.startsWith(config_1.PREFIX + "plist")) return [3 /*break*/, 4];
                    return [4 /*yield*/, playPlaylist_1.playPlaylist(message, serverInfo, queue_1, true)];
                case 3: return [2 /*return*/, _a.sent()];
                case 4:
                    // SKIP COMMAND
                    if (message.content.startsWith(config_1.PREFIX + "skip")) {
                        return [2 /*return*/, skip_1.skip(message, serverInfo, queue_1)];
                    }
                    // ASSERT DOMINANCE COMMAND
                    if (message.content.startsWith(config_1.PREFIX + "assertdominance") ||
                        message.content.startsWith(config_1.PREFIX + "assert")) {
                        return [2 /*return*/, assertDominance_1.assertDominance(serverInfo, message, queue_1)];
                    }
                    // STOP COMMAND
                    if (message.content.startsWith(config_1.PREFIX + "stop")) {
                        stop_1.stop(message, serverInfo, queue_1, client_1);
                        return [2 /*return*/];
                    }
                    // EMPTY QUEUE COMMAND
                    if (message.content.startsWith(config_1.PREFIX + "emptyqueue")) {
                        return [2 /*return*/, emptyQueue_1.emptyQueue(serverInfo, message)];
                    }
                    // GOD COMMAND
                    if (message.content.startsWith(config_1.PREFIX + "god")) {
                        return [2 /*return*/, god_1.god(message)];
                    }
                    // LIST QUEUE COMMAND
                    if (message.content.startsWith(config_1.PREFIX + "listqueue") ||
                        message.content.startsWith(config_1.PREFIX + "queue") ||
                        message.content.startsWith(config_1.PREFIX + "list")) {
                        return [2 /*return*/, listQueue_1.listQueue(serverInfo, message)];
                    }
                    // SET VOLUME COMMAND
                    if (message.content.startsWith(config_1.PREFIX + "setvolume")) {
                        return [2 /*return*/, setVolume_1.setVolume(serverInfo, message)];
                    }
                    // HELP COMMAND
                    if (message.content.startsWith(config_1.PREFIX + "help")) {
                        return [2 /*return*/, help_1.help(message)];
                    }
                    // HELLO COMMAND
                    if (message.content.startsWith(config_1.PREFIX + "\u101F\u102D\u102F\u1004\u103A\u1038")) {
                        return [2 /*return*/, hello_1.hello(message)];
                    }
                    // RESET COMMAND
                    if (message.content.startsWith(config_1.PREFIX + "reset")) {
                        return [2 /*return*/, reset_1.reset(message, serverInfo, queue_1, client_1)];
                    }
                    // CURRENTLY PLAYING COMMAND
                    if (message.content.startsWith(config_1.PREFIX + "current")) {
                        return [2 /*return*/, currentPlaying_1.currentlyPlaying(serverInfo, message)];
                    }
                    // PAUSE COMMAND
                    if (message.content.startsWith(config_1.PREFIX + "pause")) {
                        return [2 /*return*/, pause_1.togglePause(serverInfo, message)];
                    }
                    // PLAYBOING COMMAND
                    if (message.content.startsWith(config_1.PREFIX + "boing")) {
                        return [2 /*return*/, playUrl_1.playUrl(message, serverInfo, queue_1, "https://www.youtube.com/watch?v=d7vfbyFl5kc")];
                    }
                    // GROCERY COMMAND
                    if (message.content.startsWith(config_1.PREFIX + "grocery")) {
                        return [2 /*return*/, playUrl_1.playUrl(message, serverInfo, queue_1, "https://www.youtube.com/watch?v=GTsBU3RtF2c&t=766s")];
                    }
                    // SCOOBY COMMAND
                    if (message.content.startsWith(config_1.PREFIX + "scoob") ||
                        message.content.startsWith(config_1.PREFIX + "scooby")) {
                        return [2 /*return*/, playUrl_1.playUrl(message, serverInfo, queue_1, "https://www.youtube.com/watch?v=xW6UWCUMhNE")];
                    }
                    // PART COMMAND
                    if (message.content.startsWith(config_1.PREFIX + "party")) {
                        return [2 /*return*/, playUrl_1.playUrl(message, serverInfo, queue_1, "https://www.youtube.com/watch?v=N4Db0oYKXvw")];
                    }
                    // DEATH COMMAND
                    if (message.content.startsWith(config_1.PREFIX + "death")) {
                        return [2 /*return*/, playUrl_1.playUrl(message, serverInfo, queue_1, "https://www.youtube.com/watch?v=9Z1IGjr2cT0")];
                    }
                    message.channel.send("You need to enter a valid command!");
                    return [2 /*return*/];
            }
        });
    }); });
    client_1.login(config_1.TOKEN);
}
catch (err) {
    console.log(err);
}
