"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTokenPrice = void 0;
const calculateTokenPrice = (supply, reserveBalance, constant) => {
    return (reserveBalance * constant) / (supply + 1);
};
exports.calculateTokenPrice = calculateTokenPrice;
