"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv").config("../.env");
const DB_CONNECTION = process.env.MONGODB_URI;
const init = () => {
    if (DB_CONNECTION === undefined)
        return;
    if (mongoose_1.default.connection.readyState === mongoose_1.default.ConnectionStates.connected)
        return;
    mongoose_1.default
        .connect(DB_CONNECTION)
        .then((v) => {
        console.log(`mongodb database connected`);
    })
        .catch((e) => {
        console.error(`mongodb error ${e}`);
    });
};
exports.init = init;
