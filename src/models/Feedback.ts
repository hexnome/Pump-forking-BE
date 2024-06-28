// models/Coin.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    coinId: { type: mongoose.Schema.Types.ObjectId, ref: 'Coin', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    msg: { type: String, required: true },
    img: { type: String },
    time: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

export default Message;

