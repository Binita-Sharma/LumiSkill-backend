import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { askGemini } from "./services/aiService.js";
import { generateConcept } from "./services/conceptService.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "LumiSkill backend is running 🚀" });
});

app.get("/api/test-ai", async (req, res) => {
  try {
    const result = await askGemini(
      "Say hello to a student named Rahul in one short friendly sentence."
    );
    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong calling Gemini" });
  }
});

// TEMPORARY - just for testing, we'll remove this later
app.get("/api/test-concept", async (req, res) => {
  try {
    const concept = await generateConcept("Trigonometry", {
      name: "Rahul",
      interests: ["Sports"],
      favouriteSubjects: ["Mathematics"],
      learningStyle: "visual",
    });
    res.json(concept);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate concept" });
  }
});

app.post("/api/concept", async (req, res) => {
  try {
    const { topic, studentProfile } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const concept = await generateConcept(topic, studentProfile || {});
    res.json(concept);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate concept" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});