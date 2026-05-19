import express from "express";
import { GoogleGenAI } from "@google/genai";

const aiRouter = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

aiRouter.post("/ask", async (req, res) => {
  const { prompt } = req.body;

  console.log("🤖 prompt:", prompt);
  console.log("🔑 Key:", process.env.GEMINI_API_KEY ? "YES ✅" : "NO ❌");

  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    const text = response.text;
    console.log("📦 Gemini response:", text?.slice(0, 100));
    res.json({ answer: text });
  } catch (err) {
    console.error("❌ Gemini error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default aiRouter;