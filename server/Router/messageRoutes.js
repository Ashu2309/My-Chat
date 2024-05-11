import express from "express";
import * as messageController from "../controllers/messageController.js"
import { Auth } from "../middleware/Auth.js";
const router = express.Router()

router.route("/").post(Auth, messageController.sendMessage)
router.route("/:msgId").get(Auth, messageController.getMessage)

export default router;