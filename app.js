import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- OpenAI Setup ---
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- APIs ---
app.post("/api/match", (req, res) => {
  const recos = {
    reach: [{ name: "Stanford University" }, { name: "MIT" }],
    match: [{ name: "UC Davis" }, { name: "University of Washington" }],
    safety: [{ name: "San Jose State University" }, { name: "Cal State Fullerton" }]
  };
  res.json({ recos });
});

app.post("/api/scholarships", (req, res) => {
  const scholarships = [
    { name: "Tech Trailblazers", amount: 7500 },
    { name: "First Gen Leaders", amount: 5000 }
  ];
  res.json({ scholarships });
});

app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful college planning assistant for Gen Alpha students." },
        { role: "user", content: message }
      ]
    });
    res.json({ response: completion.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: "OpenAI call failed" });
  }
});

// --- Serve Frontend ---
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// --- Start ---
app.listen(3000, () => console.log("✅ App running at http://localhost:3000"));
