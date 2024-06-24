"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config.js");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./routes/user"));
const coin_1 = __importDefault(require("./routes/coin"));
const feedback_1 = __importDefault(require("./routes/feedback"));
const coinTradeRoutes_1 = __importDefault(require("./routes/coinTradeRoutes"));
const chart_1 = __importDefault(require("./routes/chart"));
const dbConncetion_1 = require("./db/dbConncetion");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000'
}));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
(0, dbConncetion_1.init)();
app.set('port', 5000);
app.use('/user/', user_1.default);
app.use('/coin/', coin_1.default);
app.use('/feedback/', feedback_1.default);
app.use('/cointrade/', coinTradeRoutes_1.default);
app.use('/chart/', chart_1.default);
exports.default = app;
