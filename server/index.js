import express, { json } from "express";
const app = express();
const PORT = process.env.PORT || 5000;
import connectDB from "./config/db.js";
import userRouter from "./Router/userRoutes.js";
import chatRouter from "./Router/chatRoutes.js";
import messageRouter from "./Router/messageRoutes.js"
import cors from "cors"

app.use(cors())
connectDB()

app.use(json())
app.use("/api/user", userRouter)
app.use("/api/chats", chatRouter)
app.use("/api/message", messageRouter)



// app.use("/", (req, res) => {
//     res.status(200).send("Server is Active")
// })


app.listen(PORT, console.log("Server started on " + PORT));