"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/Coin.js
const mongoose_1 = __importDefault(require("mongoose"));
const coinSchema = new mongoose_1.default.Schema({
    creator: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, },
    ticker: { type: String, required: true, },
    description: { type: String },
    token: { type: String, },
    reserveOne: { type: Number, default: 1_000_000_000_000_000 },
    reserveTwo: { type: Number, default: 30_000_000_000 },
    url: { type: String, requried: true },
    date: { type: Date, default: new Date }
});
const Coin = mongoose_1.default.model('Coin', coinSchema);
exports.default = Coin;
