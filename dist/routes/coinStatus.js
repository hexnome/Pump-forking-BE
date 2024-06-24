"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCoinStatus = void 0;
const CoinsStatus_1 = __importDefault(require("../models/CoinsStatus"));
const Coin_1 = __importDefault(require("../models/Coin"));
const User_1 = __importDefault(require("../models/User"));
const setCoinStatus = async (data) => {
    console.log("+++++++++++++++++++++++++++++++++++++++");
    const coinId = await Coin_1.default.findOne({ token: data.mint }).select('_id');
    const userId = await User_1.default.findOne({ wallet: data.owner }).select('_id');
    const newTx = {
        holder: userId?._id,
        holdingStatus: data.swapType,
        amount: data.swapAmount,
        tx: data.tx,
        price: data.reserve2 / data.reserve1
    };
    CoinsStatus_1.default.findOne({ coinId: coinId?._id })
        .then((coinStatus) => {
        coinStatus?.record.push(newTx);
        coinStatus?.save();
    });
    console.log("Update coin when buy or sell", data);
    const updateCoin = await Coin_1.default.findOneAndUpdate({ token: data.mint }, { reserveOne: data.reserve1, reserveTwo: data.reserve2 }, { new: true });
    console.log("updat ed coin", updateCoin);
};
exports.setCoinStatus = setCoinStatus;
