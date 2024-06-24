"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverflowOrUnderflowOccurred = exports.FailedToRemoveLiquidity = exports.FailedToAddLiquidity = exports.InvalidFee = exports.InvalidAmount = exports.InsufficientFunds = exports.InsufficientShares = exports.FailedToDeallocateShares = exports.FailedToAllocateShares = exports.DuplicateTokenNotAllowed = void 0;
exports.fromCode = fromCode;
class DuplicateTokenNotAllowed extends Error {
    logs;
    static code = 6000;
    code = 6000;
    name = "DuplicateTokenNotAllowed";
    msg = "Duplicate tokens are not allowed";
    constructor(logs) {
        super("6000: Duplicate tokens are not allowed");
        this.logs = logs;
    }
}
exports.DuplicateTokenNotAllowed = DuplicateTokenNotAllowed;
class FailedToAllocateShares extends Error {
    logs;
    static code = 6001;
    code = 6001;
    name = "FailedToAllocateShares";
    msg = "Failed to allocate shares";
    constructor(logs) {
        super("6001: Failed to allocate shares");
        this.logs = logs;
    }
}
exports.FailedToAllocateShares = FailedToAllocateShares;
class FailedToDeallocateShares extends Error {
    logs;
    static code = 6002;
    code = 6002;
    name = "FailedToDeallocateShares";
    msg = "Failed to deallocate shares";
    constructor(logs) {
        super("6002: Failed to deallocate shares");
        this.logs = logs;
    }
}
exports.FailedToDeallocateShares = FailedToDeallocateShares;
class InsufficientShares extends Error {
    logs;
    static code = 6003;
    code = 6003;
    name = "InsufficientShares";
    msg = "Insufficient shares";
    constructor(logs) {
        super("6003: Insufficient shares");
        this.logs = logs;
    }
}
exports.InsufficientShares = InsufficientShares;
class InsufficientFunds extends Error {
    logs;
    static code = 6004;
    code = 6004;
    name = "InsufficientFunds";
    msg = "Insufficient funds to swap";
    constructor(logs) {
        super("6004: Insufficient funds to swap");
        this.logs = logs;
    }
}
exports.InsufficientFunds = InsufficientFunds;
class InvalidAmount extends Error {
    logs;
    static code = 6005;
    code = 6005;
    name = "InvalidAmount";
    msg = "Invalid amount to swap";
    constructor(logs) {
        super("6005: Invalid amount to swap");
        this.logs = logs;
    }
}
exports.InvalidAmount = InvalidAmount;
class InvalidFee extends Error {
    logs;
    static code = 6006;
    code = 6006;
    name = "InvalidFee";
    msg = "Invalid fee";
    constructor(logs) {
        super("6006: Invalid fee");
        this.logs = logs;
    }
}
exports.InvalidFee = InvalidFee;
class FailedToAddLiquidity extends Error {
    logs;
    static code = 6007;
    code = 6007;
    name = "FailedToAddLiquidity";
    msg = "Failed to add liquidity";
    constructor(logs) {
        super("6007: Failed to add liquidity");
        this.logs = logs;
    }
}
exports.FailedToAddLiquidity = FailedToAddLiquidity;
class FailedToRemoveLiquidity extends Error {
    logs;
    static code = 6008;
    code = 6008;
    name = "FailedToRemoveLiquidity";
    msg = "Failed to remove liquidity";
    constructor(logs) {
        super("6008: Failed to remove liquidity");
        this.logs = logs;
    }
}
exports.FailedToRemoveLiquidity = FailedToRemoveLiquidity;
class OverflowOrUnderflowOccurred extends Error {
    logs;
    static code = 6009;
    code = 6009;
    name = "OverflowOrUnderflowOccurred";
    msg = "Overflow or underflow occured";
    constructor(logs) {
        super("6009: Overflow or underflow occured");
        this.logs = logs;
    }
}
exports.OverflowOrUnderflowOccurred = OverflowOrUnderflowOccurred;
function fromCode(code, logs) {
    switch (code) {
        case 6000:
            return new DuplicateTokenNotAllowed(logs);
        case 6001:
            return new FailedToAllocateShares(logs);
        case 6002:
            return new FailedToDeallocateShares(logs);
        case 6003:
            return new InsufficientShares(logs);
        case 6004:
            return new InsufficientFunds(logs);
        case 6005:
            return new InvalidAmount(logs);
        case 6006:
            return new InvalidFee(logs);
        case 6007:
            return new FailedToAddLiquidity(logs);
        case 6008:
            return new FailedToRemoveLiquidity(logs);
        case 6009:
            return new OverflowOrUnderflowOccurred(logs);
    }
    return null;
}
