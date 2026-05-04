import express from "express";

const aiRouter = express.Router();

aiRouter.post("/ask", async (req, res) => {
  const { prompt } = req.body;

  console.log("🤖 prompt:", prompt);
  console.log("🔑 Key:", process.env.GROQ_API_KEY ? "YES ✅" : "NO ❌");

  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    console.log("📦 Full Groq response:", JSON.stringify(data)); // 👈 this line added
    const text = data.choices?.[0]?.message?.content;

    if (!text) return res.status(500).json({ error: "No response from AI" });
    res.json({ answer: text });
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default aiRouter;