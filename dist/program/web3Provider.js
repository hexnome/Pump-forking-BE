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
exports.makeTxVersion = exports.removeLiquidityIx = exports.initializeIx = exports.createLPIx = void 0;
const anchor = __importStar(require("@coral-xyz/anchor"));
const programId_1 = require("./cli/programId");
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const instructions_1 = require("./cli/instructions");
const token_1 = require("@coral-xyz/anchor/dist/cjs/utils/token");
const raydium_sdk_1 = require("@raydium-io/raydium-sdk");
const web3_1 = require("./web3");
const curveSeed = "CurveConfiguration";
const POOL_SEED_PREFIX = "liquidity_pool";
const LP_SEED_PREFIX = "LiqudityProvider";
const createLPIx = async (mintToken, payer) => {
    const [poolPda] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from(POOL_SEED_PREFIX), mintToken.toBuffer()], programId_1.PROGRAM_ID);
    const [globalAccount] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("global")], programId_1.PROGRAM_ID);
    const [liquidityProviderAccount] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from(LP_SEED_PREFIX), poolPda.toBuffer(), payer.toBuffer()], programId_1.PROGRAM_ID);
    const poolTokenOne = await (0, spl_token_1.getAssociatedTokenAddress)(mintToken, globalAccount, true);
    const userAta1 = await (0, spl_token_1.getAssociatedTokenAddress)(mintToken, payer);
    const acc = {
        pool: poolPda,
        globalAccount,
        mintTokenOne: mintToken,
        poolTokenAccountOne: poolTokenOne,
        userTokenAccountOne: userAta1,
        liquidityProviderAccount: liquidityProviderAccount,
        user: payer,
        tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
        associatedTokenProgram: token_1.ASSOCIATED_PROGRAM_ID,
        rent: web3_js_1.SYSVAR_RENT_PUBKEY,
        systemProgram: web3_js_1.SystemProgram.programId
    };
    const args = {
        amountOne: new anchor.BN(1000000000000000),
        amountTwo: new anchor.BN(30000000000)
    };
    const ix = (0, instructions_1.addLiquidity)(args, acc);
    return { ix, acc };
};
exports.createLPIx = createLPIx;
const initializeIx = async (payer) => {
    const [curveConfig] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from(curveSeed)], programId_1.PROGRAM_ID);
    const [globalAccount] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("global")], programId_1.PROGRAM_ID);
    const acc = {
        dexConfigurationAccount: curveConfig,
        globalAccount,
        admin: payer,
        rent: web3_js_1.SYSVAR_RENT_PUBKEY,
        systemProgram: web3_js_1.SystemProgram.programId
    };
    const args = {
        fee: 1
    };
    const ix = (0, instructions_1.initialize)(args, acc);
    return { ix, acc };
};
exports.initializeIx = initializeIx;
// export const performTx = async (
//     address: string,
//     txId: string,
// ) => {
//     try{
//         console.log("==============")
//         let txInfo;
//         for(let i=0; ; i++) {
//             await sleep(2000)
//             txInfo = await getDataFromSignature(txId, io); 
//             console.log(txInfo)
//             if (txInfo !== undefined) {
//                 break;
//             }
//             if (i > 30) {
//                 io.emit("performedTx", address, "Time Out");
//                 return;
//             }
//         }
//     } catch (err) {
//     }
// }
// const getDataFromSignature = async (sig: string, io: Server) => {
//     try {
//         let tx = await connection.getParsedTransaction(sig,'confirmed');
//         if (tx && tx.meta && !tx.meta.err) {   
//             let length = tx.transaction.message.instructions.length;
//             for (let i = length; i > 0; i--) {
//                     const ix = tx.transaction.message.instructions[i-1]  as ParsedInstruction
//                     if (ix.programId.toBase58() === SPL_TOKEN_PROGRAM ) {
//                         console.log(ix, " =============> ix")
//                         const srcAcc = await connection.getParsedAccountInfo(new PublicKey(ix.parsed.info.source));
//                         const destAcc = await connection.getParsedAccountInfo(new PublicKey(ix.parsed.info.destination));
//                         const src = (srcAcc.value?.data as ParsedAccountData).parsed.info.owner;
//                         const dest = (destAcc.value?.data as ParsedAccountData).parsed.info.owner;
//                         const amount = parseInt(ix.parsed.info.amount);
//                         break;
//                     }
//             }
//             return true;
//         }
//     } catch (error) {
//         console.log("error:", error)
//     }
// }
// export const createAddLPIx = (
//     mintTokenOne: PublicKey,
//     mintTokenTwo: PublicKey,
//     payer: PublicKey,
//     amountOne: anchor.BN,
//     amountTwo: anchor.BN
// ) => {
//     const [poolPda] = PublicKey.findProgramAddressSync(
//         [Buffer.from("liquidity_pool"), Buffer.from(mintTokenOne > mintTokenTwo ? mintTokenOne.toBase58()+mintTokenTwo.toBase58() :  mintTokenTwo.toBase58()+mintTokenOne.toBase58()) ],
//         PROGRAM_ID
//     )
//     const [liquidityProviderAccount] = PublicKey.findProgramAddressSync(
//         [Buffer.from("LiqudityProvider"), poolPda.toBuffer(), payer.toBuffer()],
//         PROGRAM_ID
//     )
//     const poolTokenAccountOne = getAssociatedTokenAddressSync(mintTokenOne, poolPda); 
//     const poolTokenAccountTwo = getAssociatedTokenAddressSync(mintTokenOne, poolPda); 
//     const userTokenAccountOne = getAssociatedTokenAddressSync(mintTokenOne, payer); 
//     const userTokenAccountTwo = getAssociatedTokenAddressSync(mintTokenOne, payer); 
//     const acc: AddLiquidityAccounts = {
//         pool: poolPda,
//         liquidityProviderAccount,
//         mintTokenOne,
//         mintTokenTwo,
//         poolTokenAccountOne,
//         poolTokenAccountTwo,
//         userTokenAccountOne,
//         userTokenAccountTwo,
//         user: payer,
//         systemProgram: SystemProgram.programId,
//         tokenProgram:TOKEN_PROGRAM_ID,
//         associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID
//     }
//     const args: AddLiquidityArgs = {
//         amountOne,
//         amountTwo
//     }
//     const ix = addLiquidity(args, acc);
//     return {ix, acc}
// }
// export const createRemoveLPIx = (
//     mintTokenOne: PublicKey,
//     mintTokenTwo: PublicKey,
//     payer: PublicKey,
//     shares: anchor.BN,
// ) => {
//     const [poolPda] = PublicKey.findProgramAddressSync(
//         [Buffer.from("liquidity_pool"), Buffer.from(mintTokenOne > mintTokenTwo ? mintTokenOne.toBase58()+mintTokenTwo.toBase58() :  mintTokenTwo.toBase58()+mintTokenOne.toBase58()) ],
//         PROGRAM_ID
//     )
//     const [liquidityProviderAccount] = PublicKey.findProgramAddressSync(
//         [Buffer.from("LiqudityProvider"), poolPda.toBuffer(), payer.toBuffer()],
//         PROGRAM_ID
//     )
//     const poolTokenAccountOne = getAssociatedTokenAddressSync(mintTokenOne, poolPda); 
//     const poolTokenAccountTwo = getAssociatedTokenAddressSync(mintTokenOne, poolPda); 
//     const userTokenAccountOne = getAssociatedTokenAddressSync(mintTokenOne, payer); 
//     const userTokenAccountTwo = getAssociatedTokenAddressSync(mintTokenOne, payer); 
//     const acc: RemoveLiquidityAccounts = {
//         pool: poolPda,
//         liquidityProviderAccount,
//         mintTokenOne,
//         mintTokenTwo,
//         poolTokenAccountOne,
//         poolTokenAccountTwo,
//         userTokenAccountOne,
//         userTokenAccountTwo,
//         user: payer,
//         systemProgram: SystemProgram.programId,
//         tokenProgram:TOKEN_PROGRAM_ID,
//         associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID
//     }
//     const args: RemoveLiquidityArgs = {
//         shares
//     }
//     const ix = removeLiquidity(args, acc);
//     return {ix, acc}
// }
// export const createSwapIx = (
//     mintTokenOne: PublicKey,
//     mintTokenTwo: PublicKey,
//     payer: PublicKey,
//     amount: anchor.BN,
// ) => {
//     const [poolPda] = PublicKey.findProgramAddressSync(
//         [Buffer.from("liquidity_pool"), Buffer.from(mintTokenOne > mintTokenTwo ? mintTokenOne.toBase58()+mintTokenTwo.toBase58() :  mintTokenTwo.toBase58()+mintTokenOne.toBase58()) ],
//         PROGRAM_ID
//     )
//     const [dexConfigurationAccount] = PublicKey.findProgramAddressSync(
//         [Buffer.from("CurveConfiguration")],
//         PROGRAM_ID
//     )
//     const poolTokenAccountOne = getAssociatedTokenAddressSync(mintTokenOne, poolPda); 
//     const poolTokenAccountTwo = getAssociatedTokenAddressSync(mintTokenOne, poolPda); 
//     const userTokenAccountOne = getAssociatedTokenAddressSync(mintTokenOne, payer); 
//     const userTokenAccountTwo = getAssociatedTokenAddressSync(mintTokenOne, payer); 
//     const acc: SwapAccounts = {
//         dexConfigurationAccount,
//         pool: poolPda,
//         mintTokenOne,
//         mintTokenTwo,
//         poolTokenAccountOne,
//         poolTokenAccountTwo,
//         userTokenAccountOne,
//         userTokenAccountTwo,
//         user: payer,
//         systemProgram: SystemProgram.programId,
//         tokenProgram:TOKEN_PROGRAM_ID,
//         associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID
//     }
//     const args: SwapArgs = {
//         amount
//     }
//     const ix = swap(args, acc);
//     return {ix, acc}
// }
const removeLiquidityIx = async (mintToken, 
// amountOne: anchor.BN,
// amountTwo: anchor.BN,
payer, connection) => {
    try {
        const ammProgram = new web3_js_1.PublicKey("HWy1jotHpo6UqeQxx49dpYYdQB8wj9Qk9MdxwjLvDHB8");
        console.log("Remove::::::::");
        //  coin mint address
        const coinMint = mintToken;
        console.log("coinMint: ", coinMint.toBase58());
        //  coin mint address
        const pcMint = new web3_js_1.PublicKey("So11111111111111111111111111111111111111112");
        console.log("pcMint: ", pcMint.toBase58());
        //  market address
        const createMarketInstruments = await raydium_sdk_1.MarketV2.makeCreateMarketInstructionSimple({
            connection,
            wallet: payer,
            baseInfo: { mint: mintToken, decimals: 9 },
            quoteInfo: { mint: pcMint, decimals: 9 },
            lotSize: 1, // default 1
            tickSize: 0.01, // default 0.01
            dexProgramId: raydium_sdk_1.DEVNET_PROGRAM_ID.OPENBOOK_MARKET,
            makeTxVersion: exports.makeTxVersion,
        });
        const willSendTx = await (0, raydium_sdk_1.buildSimpleTransaction)({
            connection,
            makeTxVersion: exports.makeTxVersion,
            payer,
            innerTransactions: createMarketInstruments.innerTransactions,
        });
        const market = createMarketInstruments.address.marketId;
        const [poolPda] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("liquidity_pool"), mintToken.toBuffer()], programId_1.PROGRAM_ID);
        const [globalAccount] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("global")], programId_1.PROGRAM_ID);
        console.log("globalAccount: ", globalAccount.toBase58());
        const [liquidityProviderAccount] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("LiqudityProvider"), poolPda.toBuffer(), payer.toBuffer()], programId_1.PROGRAM_ID);
        console.log(poolPda, "===================");
        const [amm] = web3_js_1.PublicKey.findProgramAddressSync([ammProgram.toBuffer(), market.toBuffer(), Buffer.from("amm_associated_seed")], ammProgram);
        console.log("amm: ", amm.toBase58());
        const [ammAuthority] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("amm authority")], ammProgram);
        console.log("ammAuthority: ", ammAuthority.toBase58());
        const [ammOpenOrders] = web3_js_1.PublicKey.findProgramAddressSync([ammProgram.toBuffer(), market.toBuffer(), Buffer.from("open_order_associated_seed")], ammProgram);
        console.log("ammOpenOrders: ", ammOpenOrders.toBase58());
        const [lpMint] = web3_js_1.PublicKey.findProgramAddressSync([ammProgram.toBuffer(), market.toBuffer(), Buffer.from("lp_mint_associated_seed")], ammProgram);
        console.log("lpMint: ", lpMint.toBase58());
        console.log("coinMint: ", coinMint.toBase58());
        console.log("pcMint: ", pcMint.toBase58());
        const [coinVault] = web3_js_1.PublicKey.findProgramAddressSync([ammProgram.toBuffer(), market.toBuffer(), Buffer.from("coin_vault_associated_seed")], ammProgram);
        console.log("coinVault: ", coinVault.toBase58());
        const [pcVault] = web3_js_1.PublicKey.findProgramAddressSync([ammProgram.toBuffer(), market.toBuffer(), Buffer.from("pc_vault_associated_seed")], ammProgram);
        console.log("pcVault: ", pcVault.toBase58());
        //  fee destination
        const feeDestination = new web3_js_1.PublicKey("3XMrhbv989VxAMi3DErLV9eJht1pHppW5LbKxe9fkEFR");
        console.log("feeDestination: ", feeDestination.toBase58());
        const [targetOrders] = web3_js_1.PublicKey.findProgramAddressSync([ammProgram.toBuffer(), market.toBuffer(), Buffer.from("target_associated_seed")], ammProgram);
        console.log("targetOrders: ", targetOrders.toBase58());
        const [ammConfig] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("amm_config_account_seed")], ammProgram);
        console.log("ammConfig: ", ammConfig.toBase58());
        console.log("serumProgram: ", "EoTcMgcDRTJVZDMZWBoU6rhYHZfkNTVEAfz3uUJRcYGj");
        console.log("serumMarket: ", market.toBase58());
        const userWallet = new web3_js_1.PublicKey("EmPsWiBxEy6rXNj3VVtHLNAmP5hUaVUrDH3QXiTttDgy");
        console.log("userWallet: ", userWallet.toBase58());
        const userTokenCoin = await (0, spl_token_1.getAssociatedTokenAddress)(coinMint, globalAccount, true);
        console.log("userTokenCoin: ", userTokenCoin.toBase58());
        const userTokenPc = await (0, spl_token_1.getAssociatedTokenAddress)(pcMint, globalAccount, true);
        console.log("userTokenPc: ", userTokenPc.toBase58());
        const userTokenLp = await (0, spl_token_1.getAssociatedTokenAddress)(lpMint, globalAccount, true);
        console.log("userTokenLp: ", userTokenLp.toBase58());
        const ixs = [];
        const newTokenAccount = await raydium_sdk_1.Spl.insertCreateWrappedNativeAccount({
            connection,
            owner: globalAccount,
            payer,
            instructions: ixs,
            instructionsType: [],
            signers: [web3_1.adminKeypair],
            amount: new anchor.BN(1000000000),
        });
        const nonce = 252;
        const acc = {
            pool: poolPda,
            globalAccount,
            ammProgram,
            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
            associatedTokenProgram: token_1.ASSOCIATED_PROGRAM_ID,
            systemProgram: web3_js_1.SystemProgram.programId,
            sysvarRent: web3_js_1.SYSVAR_RENT_PUBKEY,
            amm,
            ammAuthority,
            ammOpenOrders,
            lpMint,
            coinMint,
            pcMint,
            coinVault,
            pcVault,
            targetOrders,
            ammConfig,
            feeDestination,
            marketProgram: new web3_js_1.PublicKey("EoTcMgcDRTJVZDMZWBoU6rhYHZfkNTVEAfz3uUJRcYGj"),
            market,
            userWallet: payer,
            userTokenCoin,
            userTokenPc: newTokenAccount,
            userTokenLp,
        };
        const args = {
            nonce,
            initPcAmount: new anchor.BN(880000),
        };
        ixs.push((0, instructions_1.removeLiquidity)(args, acc));
        // ixs.push(Spl.makeCloseAccountInstruction({
        //   programId: TOKEN_PROGRAM_ID,
        //   tokenAccount: newTokenAccount,
        //   owner: payer,
        //   payer,
        //   instructionsType: [],
        // }));
        return { ixs, acc, willSendTx };
    }
    catch (error) {
        console.log("Error in removing liquidity", error);
    }
};
exports.removeLiquidityIx = removeLiquidityIx;
exports.makeTxVersion = raydium_sdk_1.TxVersion.LEGACY; // LEGACY
