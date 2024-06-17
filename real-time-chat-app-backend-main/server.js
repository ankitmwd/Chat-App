import dotenv from "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import UserRoute from "./routes/userRoute.js"
import { notFound,errorHandler } from "./Middleware/errorMiddleware.js";
import ChatRouter from "./routes/chatRoute.js"
import messageRoute from "./routes/messageRoute.js"
import { Server } from "socket.io";



const app = express();
app.use(cors());
app.use(express.json());
connectDB();


app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send("ApI is working");
});
app.use("/api/user", UserRoute);
app.use("/api/chat", ChatRouter);
app.use("/api/message",messageRoute)

app.use(notFound);
app.use(errorHandler);

const server= app.listen(process.env.PORT||5000, () => {
    console.log("Server is running on port "+(process.env.PORT||5000));
});
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: "*"
    }
});
io.on("connection", (socket) => {
    console.log("connection to socket io");
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });
    socket.on("join chat", (room) => {
        socket.join(room);
    });
    socket.on("typing", (room) => { 
        socket.in(room).emit("typing");
    })
    socket.on("stop typing", (room) => { 
        socket.in(room).emit("stop typing");
    })
    socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived.chat;
        if (!chat.users) return console.log("chat users not defined");
        chat.users.forEach(user => {
            if (user._id == newMessageReceived.sender._id) return;
            socket.in(user._id).emit("message received", newMessageReceived);
        })
    })
    socket.off("setup", () => {
        console.log("User Disconnected");
        socket.leave(userData._id);
    })
})
