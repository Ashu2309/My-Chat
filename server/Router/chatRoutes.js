import express from "express";
import * as chatController from "../controllers/chatController.js"
import { Auth } from "../middleware/Auth.js";
const router = express.Router()

router.route("/").post(Auth, chatController.accessChat)
router.route("/").get(Auth, chatController.fetchChat)
router.route("/group").post(Auth, chatController.createGroupChat)
router.route("/renamegroup").put(Auth, chatController.renameGroup)
router.route("/groupadd").put(Auth, chatController.addToGroup)
router.route("/groupremove").put(Auth, chatController.removeFromGroup)
router.route("/leavegroup").put(Auth, chatController.leaveGroup)


export default router;