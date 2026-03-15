import express from "express";
import { askAI } from "../Chatbot/bot.js";

const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const { message, username } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const reply = await askAI(message, username);
    console.log("AI Reply:", username);
    
    res.status(200).json({
      success: true,
      reply: reply.text,
      command: reply.command || null,
    });
  } catch (error) {
    console.error("AI Error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

export default router;
