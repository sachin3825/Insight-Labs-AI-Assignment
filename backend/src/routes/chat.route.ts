import express from "express";
import { rateLimiter } from "../middleware/rateLimiter";
import { ChatController } from "../controllers/chat.controller";

const router = express.Router();

router.post("/chat", rateLimiter, ChatController.handleChatMessage);

export default router;
