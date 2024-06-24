"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.layout = void 0;
exports.removeLiquidity = removeLiquidity;
const web3_js_1 = require("@solana/web3.js"); // eslint-disable-line @typescript-eslint/no-unused-vars
const borsh = __importStar(require("@coral-xyz/borsh")); // eslint-disable-line @typescript-eslint/no-unused-vars
const programId_1 = require("../programId");
exports.layout = borsh.struct([
    borsh.u8("nonce"),
    borsh.u64("initPcAmount"),
]);
function removeLiquidity(args, accounts, programId = programId_1.PROGRAM_ID) {
    const keys = [
        { pubkey: accounts.pool, isSigner: false, isWritable: true },
        { pubkey: accounts.globalAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.ammProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        {
            pubkey: accounts.associatedTokenProgram,
            isSigner: false,
            isWritable: false,
        },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.sysvarRent, isSigner: false, isWritable: false },
        { pubkey: accounts.amm, isSigner: false, isWritable: true },
        { pubkey: accounts.ammAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.ammOpenOrders, isSigner: false, isWritable: true },
        { pubkey: accounts.lpMint, isSigner: false, isWritable: true },
        { pubkey: accounts.coinMint, isSigner: false, isWritable: true },
        { pubkey: accounts.pcMint, isSigner: false, isWritable: true },
        { pubkey: accounts.coinVault, isSigner: false, isWritable: true },
        { pubkey: accounts.pcVault, isSigner: false, isWritable: true },
        { pubkey: accounts.targetOrders, isSigner: false, isWritable: true },
        { pubkey: accounts.ammConfig, isSigner: false, isWritable: true },
        { pubkey: accounts.feeDestination, isSigner: false, isWritable: true },
        { pubkey: accounts.marketProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.market, isSigner: false, isWritable: true },
        { pubkey: accounts.userWallet, isSigner: true, isWritable: true },
        { pubkey: accounts.userTokenCoin, isSigner: false, isWritable: true },
        { pubkey: accounts.userTokenPc, isSigner: false, isWritable: true },
        { pubkey: accounts.userTokenLp, isSigner: false, isWritable: true },
    ];
    const identifier = Buffer.from([80, 85, 209, 72, 24, 206, 177, 108]);
    const buffer = Buffer.alloc(1000);
    const len = exports.layout.encode({
        nonce: args.nonce,
        initPcAmount: args.initPcAmount,
    }, buffer);
    const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
    const ix = new web3_js_1.TransactionInstruction({ keys, programId, data });
    return ix;
}
