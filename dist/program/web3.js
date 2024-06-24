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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRaydium = exports.swapTx = exports.checkTransactionStatus = exports.createToken = exports.initializeTx = exports.uploadMetadata = exports.adminKeypair = exports.connection = void 0;
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const umi_1 = require("@metaplex-foundation/umi");
const umi_bundle_defaults_1 = require("@metaplex-foundation/umi-bundle-defaults");
const web3_js_1 = require("@solana/web3.js");
const bs58_1 = __importDefault(require("bs58"));
const Coin_1 = __importDefault(require("../models/Coin"));
const web3Provider_1 = require("./web3Provider");
const anchor_1 = require("@coral-xyz/anchor");
const nodewallet_1 = __importDefault(require("@coral-xyz/anchor/dist/cjs/nodewallet"));
const programId_1 = require("./cli/programId");
const spl_token_1 = require("@solana/spl-token");
const instructions_1 = require("./cli/instructions");
const anchor = __importStar(require("@coral-xyz/anchor"));
const token_1 = require("@coral-xyz/anchor/dist/cjs/utils/token");
const coinStatus_1 = require("../routes/coinStatus");
const CoinsStatus_1 = __importDefault(require("../models/CoinsStatus"));
const rpc_1 = require("@coral-xyz/anchor/dist/cjs/utils/rpc");
const sdk_1 = __importDefault(require("@pinata/sdk"));
const curveSeed = "CurveConfiguration";
const POOL_SEED_PREFIX = "liquidity_pool";
const LP_SEED_PREFIX = "LiqudityProvider";
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;
const PINATA_GATEWAY_URL = process.env.PINATA_GATEWAY_URL;
exports.connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)('devnet'));
const privateKey = bs58_1.default.decode(process.env.PRIVATE_KEY);
exports.adminKeypair = anchor_1.web3.Keypair.fromSecretKey(privateKey);
const adminWallet = new nodewallet_1.default(exports.adminKeypair);
// const umi = createUmi(process.env.PUBLIC_SOLANA_RPC!);
const umi = (0, umi_bundle_defaults_1.createUmi)((0, web3_js_1.clusterApiUrl)('devnet'));
const userWallet = umi.eddsa.createKeypairFromSecretKey(privateKey);
const userWalletSigner = (0, umi_1.createSignerFromKeypair)(umi, userWallet);
umi.use((0, umi_1.signerIdentity)(userWalletSigner));
umi.use((0, mpl_token_metadata_1.mplTokenMetadata)());
const uploadMetadata = async (data) => {
    // const url = data.url;
    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS/';
    console.log(data);
    const metadata = {
        name: data.name,
        ticker: data.ticker,
        URL: data.url,
        description: data.description,
    };
    const pinata = new sdk_1.default({ pinataJWTKey: PINATA_SECRET_API_KEY });
    try {
        const res = await pinata.pinJSONToIPFS(metadata);
        console.log(res, "======");
        return res;
    }
    catch (error) {
        console.error('Error uploading metadata: ', error);
        return error;
    }
};
exports.uploadMetadata = uploadMetadata;
// Initialize Transaction for smart contract
const initializeTx = async () => {
    const initTx = await (0, web3Provider_1.initializeIx)(adminWallet.publicKey);
    const createTx = new web3_js_1.Transaction().add(initTx.ix);
    console.log(adminWallet.publicKey.toBase58());
    createTx.feePayer = adminWallet.publicKey;
    createTx.recentBlockhash = (await exports.connection.getLatestBlockhash()).blockhash;
    const txId = await (0, web3_js_1.sendAndConfirmTransaction)(exports.connection, createTx, [exports.adminKeypair]);
    console.log("txId:", txId);
};
exports.initializeTx = initializeTx;
// Create Token and add liquidity transaction
const createToken = async (data) => {
    const uri = await (0, exports.uploadMetadata)(data);
    const mint = (0, umi_1.generateSigner)(umi);
    const tx = (0, mpl_token_metadata_1.createAndMint)(umi, {
        mint,
        authority: umi.identity,
        name: data.name,
        symbol: data.ticker,
        uri: data.url,
        sellerFeeBasisPoints: (0, umi_1.percentAmount)(0),
        decimals: 6,
        amount: 1000_000_000_000_000,
        tokenOwner: userWallet.publicKey,
        tokenStandard: mpl_token_metadata_1.TokenStandard.Fungible,
    });
    const mintTx = await tx.sendAndConfirm(umi);
    console.log(userWallet.publicKey, "Successfully minted 1 million tokens (", mint.publicKey, ")");
    const newCoin = new Coin_1.default({
        ...data,
        // amount: tx.amount,
        token: mint.publicKey
    });
    await sleep(5000);
    try {
        const lpTx = await (0, web3Provider_1.createLPIx)(new web3_js_1.PublicKey(mint.publicKey), exports.adminKeypair.publicKey);
        const createTx = new web3_js_1.Transaction().add(lpTx.ix);
        createTx.feePayer = adminWallet.publicKey;
        createTx.recentBlockhash = (await exports.connection.getLatestBlockhash()).blockhash;
        const txId = await (0, web3_js_1.sendAndConfirmTransaction)(exports.connection, createTx, [exports.adminKeypair]);
        console.log("txId:", txId);
        // const checkTx = await checkTransactionStatus(txId);
        const urlSeg = data.url.split('/');
        const url = `${PINATA_GATEWAY_URL}/${urlSeg[urlSeg.length - 1]}`;
        console.log(url);
        console.log('great');
        const newCoin = new Coin_1.default({
            creator: data.creator,
            name: data.name,
            ticker: data.ticker,
            description: data.description,
            token: mint.publicKey,
            url,
        });
        console.log(newCoin);
        const response = await newCoin.save();
        const newCoinStatus = new CoinsStatus_1.default({
            coinId: response._id,
            record: [
                {
                    holder: response.creator,
                    holdingStatus: 2,
                    amount: 0,
                    tx: txId,
                    price: newCoin.reserveTwo / newCoin.reserveOne
                }
            ]
        });
        await newCoinStatus.save();
        console.log("Saved Successfully...");
        return response;
    }
    catch (error) {
        return "transaction failed";
    }
};
exports.createToken = createToken;
// check transaction
const checkTransactionStatus = async (transactionId) => {
    try {
        // Fetch the transaction details using the transaction ID
        const transactionResponse = await exports.connection.getTransaction(transactionId);
        // If the transactionResponse is null, the transaction is not found
        if (transactionResponse === null) {
            console.log(`Transaction ${transactionId} not found.`);
            return false;
        }
        // Check the status of the transaction
        if (transactionResponse.meta && transactionResponse.meta.err === null) {
            return true;
        }
        else {
            console.log(`Transaction ${transactionId} failed with error: ${transactionResponse.meta?.err}`);
            return false;
        }
    }
    catch (error) {
        console.error(`Error fetching transaction ${transactionId}:`, error);
        return false;
    }
};
exports.checkTransactionStatus = checkTransactionStatus;
// Swap transaction
const swapTx = async (mint1, user) => {
    try {
        const [curveConfig] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from(curveSeed)], programId_1.PROGRAM_ID);
        const [poolPda] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from(POOL_SEED_PREFIX), mint1.toBuffer()], programId_1.PROGRAM_ID);
        const [globalAccount] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("global")], programId_1.PROGRAM_ID);
        const poolTokenOne = await (0, spl_token_1.getAssociatedTokenAddress)(mint1, globalAccount, true);
        const userAta1 = await (0, spl_token_1.getAssociatedTokenAddress)(mint1, exports.adminKeypair.publicKey);
        const args = {
            amount: new anchor.BN(20000000),
            style: new anchor.BN(2)
        };
        const acc = {
            dexConfigurationAccount: curveConfig,
            pool: poolPda,
            globalAccount,
            mintTokenOne: mint1,
            poolTokenAccountOne: poolTokenOne,
            userTokenAccountOne: userAta1,
            user: exports.adminKeypair.publicKey,
            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
            associatedTokenProgram: token_1.ASSOCIATED_PROGRAM_ID,
            rent: web3_js_1.SYSVAR_RENT_PUBKEY,
            systemProgram: web3_js_1.SystemProgram.programId
        };
        const dataIx = await (0, instructions_1.swap)(args, acc, programId_1.PROGRAM_ID);
        const tx = new web3_js_1.Transaction().add(dataIx);
        tx.feePayer = exports.adminKeypair.publicKey;
        tx.recentBlockhash = (await exports.connection.getLatestBlockhash()).blockhash;
        // console.log(await connection.simulateTransaction(tx))
        const sig = await (0, web3_js_1.sendAndConfirmTransaction)(exports.connection, tx, [exports.adminKeypair], { skipPreflight: true });
        return sig;
    }
    catch (error) {
        console.log("Error in swap transaction", error);
    }
};
exports.swapTx = swapTx;
// Get info when user buy or sell token
const logTx = exports.connection.onLogs(programId_1.PROGRAM_ID, async (logs, ctx) => {
    if (logs.err !== null) {
        return undefined;
    }
    if (logs.logs[1].includes('AddLiquidity')) {
        return undefined;
    }
    console.log(logs);
    // Get parsed log data
    const parsedData = parseLogs(logs.logs, logs.signature);
    console.log(parsedData);
    if (parsedData.reserve2 > 80_000_000_000) {
        // Remove liquidity poll and move to Raydium
        // createRaydium()
        return;
    }
    await (0, coinStatus_1.setCoinStatus)(parsedData);
}, "confirmed");
// Remove liquidity pool and Create Raydium Pool
const createRaydium = async (mint1) => {
    const amountOne = 1000_000_000_000;
    const amountTwo = 1000_000_000_000;
    const radyiumIx = await (0, web3Provider_1.removeLiquidityIx)(mint1, exports.adminKeypair.publicKey, exports.connection);
    if (radyiumIx == undefined)
        return;
    for (const iTx of radyiumIx.willSendTx) {
        if (iTx instanceof web3_js_1.VersionedTransaction) {
            iTx.sign([exports.adminKeypair]);
            await exports.connection.sendTransaction(iTx, {
                skipPreflight: true
            });
        }
        else {
            await (0, web3_js_1.sendAndConfirmTransaction)(exports.connection, iTx, [exports.adminKeypair], {
                skipPreflight: true
            });
        }
    }
    // console.log(await connection.simulateTransaction(radyiumIx.tx1))
    // await connection.sendTransaction(radyiumIx.tx1, [adminKeypair]);
    const tx = new web3_js_1.Transaction().add(web3_js_1.ComputeBudgetProgram.setComputeUnitLimit({ units: 400_000 }));
    for (let i = 0; i < radyiumIx.ixs.length; i++) {
        tx.add(radyiumIx.ixs[i]);
    }
    tx.feePayer = exports.adminKeypair.publicKey;
    tx.recentBlockhash = (await exports.connection.getLatestBlockhash()).blockhash;
    // console.dir((await simulateTransaction(connection, tx)), { depth: null })
    const ret = await (0, rpc_1.simulateTransaction)(exports.connection, tx);
    if (!ret.value.logs)
        return "";
    for (let i = 0; i < ret.value.logs?.length; i++)
        console.log(ret.value.logs[i]);
    const sig = await (0, web3_js_1.sendAndConfirmTransaction)(exports.connection, tx, [exports.adminKeypair], { skipPreflight: true });
    return sig;
};
exports.createRaydium = createRaydium;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// Get swap(buy and sell)
function parseLogs(logs, tx) {
    const result = {
        tx,
        mint: '',
        owner: '',
        swapType: 0,
        swapAmount: 0,
        reserve1: 0,
        reserve2: 0
    };
    logs.forEach(log => {
        if (log.includes('Mint: ')) {
            result.mint = (log.split(' ')[3]);
        }
        if (log.includes('Swap: ')) {
            result.owner = log.split(' ')[3];
            result.swapType = parseInt(log.split(' ')[4]);
            result.swapAmount = parseInt(log.split(' ')[5]);
        }
        if (log.includes('Reserves: ')) {
            result.reserve1 = parseInt(log.split(' ')[3]);
            result.reserve2 = parseInt(log.split(' ')[4]);
        }
    });
    return result;
}
