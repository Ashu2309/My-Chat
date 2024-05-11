import expressAsyncHandler from "express-async-handler"
import jwt from "jsonwebtoken"

export const generateJWT = (userid) => {
    return jwt.sign({ userid }, process.env.SECRET, { expiresIn: "30d" })
}