// models/Coin.js
import { number } from 'joi';
import mongoose from 'mongoose';

const coinSchema = new mongoose.Schema({
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, },
    ticker: { type: String, required: true, },
    description: { type: String },
    // marketcap: {type: Number, default: 0},
    token: { type: String, },
    reserveOne: { type: Number, default: 1_000_000_000_000_000 },
    reserveTwo: { type: Number, default: 30_000_000_000 },
    url: { type: String, required: true },
    date: { type: Date, default: new Date }
});

const Coin = mongoose.model('Coin', coinSchema);

export default Coin;
