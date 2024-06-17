import asyncHandler from "express-async-handler"
import Message from "../Models/messageModel.js"
import User from "../Models/userModel.js";
import Chat from "../Models/chatModel.js";
const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;
    console.log(req.body);
    if (!content || !chatId) {
        console.log("Invalid data is passed to request")
        return res.send(400);
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    };
    try {
        var message = await Message.create(newMessage);
        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email"
        });

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
        });
        console.log(message);
        res.json(message);
        
    } catch (error) {

        res.status(400)
        throw new Error(error.message);
    }
});
const allMessages = asyncHandler(async(req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId }).populate("sender", "name pic email").populate("chat");
        res.json(messages);
    }
    catch (err) {
        res.status(400);
        throw new Error(err.message);
    }
})
export { sendMessage ,allMessages};