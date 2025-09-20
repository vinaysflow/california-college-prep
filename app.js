import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(".")); // serve index.html

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Example endpoint for AI Chat
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
    });
    res.json({ response: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI request failed" });
  }
});

// TODO: Add /api/match, /api/scholarships, etc.

app.listen(PORT, () => {
  console.log(`✅ App running at http://localhost:${PORT}`);
});
