"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const logger_1 = require("./logger");
// import { connectRedis } from './redis';
const socketio = async (server) => {
    try {
        // Socket communication
        const io = new socket_io_1.Server(server, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            },
        });
        io.close(() => {
            console.log('Server and all connected sockets closed');
        });
        io.on('connection', async (socket) => {
            const id = socket.user?.user?.id;
            console.log(`socket (${socket.id}) -> ${id}`);
        });
        // await connectRedis(io);
        logger_1.logger.info('  Socket server is running');
    }
    catch (err) {
        logger_1.logger.error('  Socket server run failed');
        console.error(err);
    }
};
exports.default = socketio;
