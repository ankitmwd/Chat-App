import express from "express";
import protect from "../Middleware/authMiddleware.js";
import { allMessages, sendMessage } from "../controllers/MessageController.js";
const router = express.Router();
router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, allMessages);

export default router;