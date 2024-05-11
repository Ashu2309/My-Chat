import asyncHandler from "express-async-handler";
import Chat from "../model/chatModel.js";
import User from "../model/userModel.js";
import mongoose from "mongoose";

export const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body
    if (!userId) {
        res.status(400).send("UserId not provided")
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: userId } } },
            { users: { $elemMatch: { $eq: req.user._id } } }
        ]
    }).populate("users", "-password").populate("latestMessage")

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email"
    })

    if (isChat.length > 0) {
        res.status(200).send(isChat[0])
    } else {
        try {
            const createdChat = await Chat.create({
                chatName: "sender",
                isGroupChat: false,
                users: [req.user._id, userId]
            })
            const response = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password")
            res.status(200).send(response)
        } catch (error) {
            res.status(400).send(error)
        }
    }
})

export const fetchChat = asyncHandler(async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (result) => {
                result = await User.populate(result, {
                    path: "latestMessage.sender",
                    select: "name pic email",
                });
                res.status(200).send(result)
            })
    } catch (error) {
        res.status(400).send(error)
    }
})

export const createGroupChat = asyncHandler(async (req, res) => {
    var users = JSON.parse(req.body.users)
    users.push(req.user._id)

    if (users.length < 2) {
        return res.status(400).send("Atleast 3 users are required to form a group")
    }

    try {
        const groupChat = await Chat.create({
            chatName: req.body.chatName,
            isGroupChat: true,
            users: users,
            groupAdmin: req.user
        })


        const response = await Chat.findOne({ _id: groupChat._id }).populate("users", "-password").populate("groupAdmin", "-password")
        res.status(200).send(response)
    } catch (error) {
        res.status(400).send(error)
    }
})

export const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;
    // const isadmin = await Chat.findOne({ chatId: chatId })
    var isadmin = await Chat.findOne({ _id: chatId, groupAdmin: req.user._id })

    console.log(isadmin)
    if (isadmin) {
        const response = await Chat.findByIdAndUpdate(chatId, { chatName }, { new: true })
            .populate("users", "-password").populate("groupAdmin", "-password")

        if (!response) {
            res.status(404).send("Chat Not Found")
        } else {
            res.json(response).status(200)
        }

    } else {
        return res.status(400).send("Only Group Admin Can Change Name")
    }
})

export const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    var isadmin = await Chat.findOne({ _id: chatId, groupAdmin: req.user._id })

    if (isadmin) {
        const isUserExist = await Chat.findOne({ _id: chatId, users: userId });


        if (!isUserExist) {
            const response = await Chat.findByIdAndUpdate(chatId, { $push: { users: userId } }, { new: true })
                .populate("users", "-password").populate("groupAdmin", "-password")

            if (!response) {
                res.status(404).send("Chat Not Found")
            } else {
                res.json(response).status(200)
            }
        } else {
            res.status(404).send("User Already Exists in group")
        }

    } else {
        return res.status(400).send("Only Group Admin Can Change Name")
    }

})

export const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    var isadmin = await Chat.findOne({ _id: chatId, groupAdmin: req.user._id })
    if (isadmin) {
        const isUserExist = await Chat.findOne({ _id: chatId, users: userId });


        if (isUserExist) {
            const response = await Chat.findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true })
                .populate("users", "-password").populate("groupAdmin", "-password")

            if (!response) {
                res.status(404).send("Chat Not Found")
            } else {
                res.json(response).status(200)
            }
        } else {
            res.status(404).send("User doesn't Exists in group")
        }

    } else {
        return res.status(400).send("Only Group Admin Can Change Name")
    }
})

export const leaveGroup = asyncHandler(async (req, res) => {
    const chatId = req.body.chatId;
    console.log(chatId)
    var isadmin = await Chat.findOne({ _id: chatId, groupAdmin: req.user._id })
    if (isadmin) {
        console.log("user is admin")
        const isChatExist = await Chat.findOne({ _id: chatId });


        if (isChatExist) {
            const response = await Chat.findByIdAndDelete(chatId)

            if (!response) {
                res.status(404).send("Chat Not Found")
            } else {
                res.json(response).status(200)
            }
        } else {
            res.status(404).send("Group Chat doesn't Exists in group")
        }

    } else {
        console.log("user is gay")

        const isUserExist = await Chat.findOne({ _id: chatId, users: req.user._id });

        if (isUserExist) {
            const response = await Chat.findByIdAndUpdate(chatId, { $pull: { users: req.user._id } }, { new: true })
                .populate("users", "-password").populate("groupAdmin", "-password")

            if (!response) {
                res.status(404).send("Chat Not Found")
            } else {
                res.json(response).status(200)
            }
        } else {
            res.status(404).send("User doesn't Exists in group")
        }
    }
})