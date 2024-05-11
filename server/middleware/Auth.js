import jwt from "jsonwebtoken";
import User from "../model/userModel.js"
import asyncHandler from "express-async-handler";

export const Auth = asyncHandler(async (req, res, next) => {
    try {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.SECRET);
            req.user = await User.findById(decoded.userid).select("-password");
            if (!req.user) throw new Error("User not found");
            next();
        } else {
            throw new Error("No token provided");
        }
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).send("Authentication failed");
    }
});
