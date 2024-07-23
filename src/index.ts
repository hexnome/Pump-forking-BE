import express from "express";
import cors from "cors";
import http from "http";
import bodyParser from "body-parser";
import { Server } from "socket.io";
import 'dotenv/config.js';
import userRoutes from './routes/user'
import coinRoutes from './routes/coin'
import messageRoutes from './routes/feedback'
import coinTradeRoutes from './routes/coinTradeRoutes'
import chartRoutes from './routes/chart'
import { init } from './db/dbConncetion';
import { io, socketio } from "./sockets";

const app = express();
const port = process.env.PORT || 5000;

const whitelist = ["http://localhost:3000"];

const corsOptions = {
    origin: "*",
    credentials: false,
    sameSite: "none",
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

init()

app.get('/', async (req, res) => {
    res.json("Success!!")
});

app.use('/api/user/', userRoutes);
app.use('/api/coin/', coinRoutes);
app.use('/api/feedback/', messageRoutes);
app.use('/api/cointrade/', coinTradeRoutes)
app.use('/api/chart/', chartRoutes)

const server = http.createServer(app);
socketio(server);

server.listen(port, async () => {
    console.log(`server is listening on ${port}`);

    return;
});
