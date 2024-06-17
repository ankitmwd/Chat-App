import asyncHandler from "express-async-handler";
import Chat  from "../Models/chatModel.js"
import User from "../Models/userModel.js";
const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({
            message: "Please provide user id"
        })
    }
    var isChat = await Chat.findOne({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } }
        ]
    }).populate("users", "-password").populate("latestMessage");
    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email"
    })
    if (isChat?.length > 0) {
        res.send(isChat[0]);
    }
    else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
            
        };
        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password");
            res.status(200).send(FullChat);
        }
        catch (error) {
            res.status(400)
            throw new Error(error.message);
        }
    }
});

const fetchChats = asyncHandler(async (req, res) => {
    try {
        await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password").populate("groupAdmin", "-password")
            .populate("latestMessage").sort({ updateAt: -1 })
            .then(async (result) => {
                result = await User.populate(result, {
                    path: "latestMessage.sender",
                    select: "name pic email"
                });
                res.status(200).send(result);
            })
        
    }
    catch (err) {
        res.status(400);
        throw new Error(err.message);
        
    }
});

const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the fields" });
    }

    var users = JSON.parse(req.body.users);
    if (users?.length < 2) {
        return res.status(400).send({ message: "More than 2 users required" });
    }
    users.push(req.user);
    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            isGroupChat: true,
            groupAdmin: req.user,
            users: users
        });
        const FullChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        res.status(200).send(FullChat);
    }
    catch (err) {
        res.status(400);
        throw new Error(err.message);
    }
});
const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(chatId, {
        chatName
    },
        {
            new: true
        }).populate("users", "-password")
        .populate("groupAdmin", "-password");
    if (!updatedChat) {
        res.status(404);
        throw new Error("Chat not found");
    }
    else {
        res.json(updatedChat)
    }
});

const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    const added = await Chat.findByIdAndUpdate(chatId, {
        $push: { users: userId },
    }, {
        new: true,
    }).populate("users", "-password")
        .populate("groupAdmin", "-password")
    if (!added) {
        res.status(404);
        throw new Error("Chat not found");
    }
    else {
        res.send(added);
    }
});
const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    const removed = await Chat.findByIdAndUpdate(chatId, {
        $pull:{users:userId},
    }, {
        new : true,
    }).populate("users", "-password")
        .populate("groupAdmin", "-password")
    if (!removed) {
        res.status(404);
        throw new Error("Chat not found");
    }
    else {
        res.status(200);
        res.send(removed); 
    }
})


export { accessChat ,fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup};