import express, { json } from "express";
import connectDB from "./config/db.js";
import userRouter from "./Router/userRoutes.js";
import chatRouter from "./Router/chatRoutes.js";
import messageRouter from "./Router/messageRoutes.js"
import cors from "cors"
import http from "http"; // Import http module
import { Server } from "socket.io"; // Import Server from socket.io
import path from "path";
import dotenv from "dotenv";

connectDB();

const app = express();
const server = http.createServer(app);

app.use(cors())
app.use(json())
app.use("/api/user", userRouter)
app.use("/api/chats", chatRouter)
app.use("/api/message", messageRouter)



// ======================deployment=====================
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname1, "/client/build")))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"))
    })
} else {
    app.get("/", (req, res) => {
        res.send("API is running..");
    });

}
// ======================deployment=====================

const PORT = process.env.PORT || 5000;

// app.use("/", (req, res) => {
//     res.status(200).send("Server is Active")
// })

server.listen(
    PORT,
    console.log(`Server running on PORT ${PORT}`)
);

const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000"
    }
});

io.on("connection", (socket) => {
    console.log("Connected To Socket.io")

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room : ", room)
    })

    socket.on("typing", (room) => socket.in(room).emit("typing"))
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"))


    socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if (!chat.users) return console.log("chat.users not defined")

        chat.users.forEach((user) => {
            if (user._id == newMessageReceived.sender._id) return;

            socket.in(user._id).emit("message received", newMessageReceived)
        })
    })

    socket.off("setup", () => {
        console.log("User Disconnected")
        socket.leave(userData._id)
    })
})