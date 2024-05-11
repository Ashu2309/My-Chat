import asyncHandler from "express-async-handler";
import Chat from "../model/chatModel.js";
import User from "../model/userModel.js";
import mongoose from "mongoose";
import Message from "../model/messageModel.js";

export const sendMessage = asyncHandler(async (req, res) => {
    try {
        const { chatId, content } = req.body;

        if (!chatId || !content) {
            res.status(400).send("Requirement not full filled")
        }

        const newMessage = {
            sender: req.user._id,
            content: content,
            chat: chatId
        }

        var message = await Message.create(newMessage)
        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email",
        });

        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: message
        })
        res.status(200).json(message)

    } catch (error) {
        res.status(400).json(error)
    }
})

export const getMessage = asyncHandler(async (req, res) => {
    try {
        const { msgId } = req.params;
        console.log(msgId)

        const response = await Message.find({ chat: msgId }).populate("sender", "-password").populate("chat");

        res.status(200).json(response)

    } catch (error) {
        res.status(400).json(error)
    }
})