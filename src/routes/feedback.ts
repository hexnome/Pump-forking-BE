import express from "express";
import Message from "../models/Feedback";
import { Date, Types } from "mongoose";
import { AuthRequest, auth } from "../middleware/authorization";
import { io } from "../sockets";

const router = express.Router();

// @route   GET /feedback/coin/:coinId
// @desc    Get messages about this coin
// @access  Public
router.get('/coin/:coinId', async (req, res) => {
    const coinId: string = req.params.coinId;
    console.log("feedback", coinId)
    const response = await Message.find({ coinId: coinId })
        .populate('sender')
    console.log("messages", response)
    res.status(200).send(response)
})

// @route   GET /feedback/:
// @desc    Get messages about this user
// @access  Public
router.get('/user/:userId', (req, res) => {
    const sender: string = req.params.userId;
    Message.find({ sender }).then(messages => res.status(200).send(messages))
        .catch(err => res.status(400).json(err));
})

// @route   POST /feedback/
// @desc    Save new Message
// @access  Public
router.post('/', async (req, res) => {
    const { body } = req;
    console.log("feedback::", body)
    try {
        const newMsg = new Message(body); 
        const messages = await newMsg.save()
        console.log(messages, "messagessssssss")
        const updatedMsg = await Message.findOne({ _id: messages._id }).populate('sender')
        if (io != null) {
            if (io != null) io.emit("messageUpdated", body.coinId, updatedMsg)
        }
        return res.status(200).send(messages)
    } catch (err) {
        return res.status(400).json(err)
    }
})

export default router;