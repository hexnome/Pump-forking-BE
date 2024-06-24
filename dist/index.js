"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const app_1 = __importDefault(require("./app"));
const sockets_1 = __importDefault(require("./sockets"));
const logger_1 = require("./sockets/logger");
// Socket communication
const server = (0, http_1.createServer)(app_1.default);
(0, sockets_1.default)(server);
/**
 * start Express server
 */
server.listen(app_1.default.get('port'), () => {
    logger_1.logger.info('  App is running at http://localhost:%d in %s mode', app_1.default.get('port'), app_1.default.get('env'));
});
exports.default = server;
