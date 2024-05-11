import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Atlas Connected : ${conn.connection.host}`)

    } catch (error) {
        console.log("Mongo ERROR ", error)
    }
}

export default connectDB