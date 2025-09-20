import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Serve static frontend (public/index.html)
app.use(express.static(path.join(__dirname, "public")));

// Init OpenAI client if key available
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// --------- API ROUTES ----------

// Scholarships
app.post("/api/scholarships", (req, res) => {
  const profile = req.body;
  // Basic mocked response
  const scholarships = [
    { name: "Tech Trailblazers", amount: 7500, due: "2025-11-01", criteria: "STEM majors" },
    { name: "First Gen Leaders", amount: 5000, due: "2025-12-01", criteria: "First-generation students" }
  ];
  res.json({ scholarships });
});

// Match schools
app.post("/api/match", (req, res) => {
  const profile = req.body;
  // Just echo back buckets (frontend also has its own engine)
  const recos = { reach: [], match: [], safety: [] };
  res.json({ recos });
});

// AI Chat
app.post("/api/ai/chat", async (req, res) => {
  const { message } = req.body;
  if (!openai) {
    return res.json({ response: `Local AI fallback: ${message}` });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }]
    });
    const reply = completion.choices[0].message.content;
    res.json({ response: reply });
  } catch (err) {
    console.error(err);
    res.json({ response: "Error contacting OpenAI" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ App running at http://localhost:${PORT}`);
});
