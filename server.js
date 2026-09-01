import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { askGemini } from "./services/aiService.js";
import { generateConcept, generateTopicList } from "./services/conceptService.js";
import { getTopicsForSubject, saveTopics } from "./services/supabaseService.js";
import { saveUserProfile, getUserProfile } from "./services/supabaseService.js";


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

app.get("/api/topics", async (req, res) => {
  try {
    const { subject, studentClass, board } = req.query;

    if (!subject || !studentClass || !board) {
      return res.status(400).json({ error: "subject, studentClass, and board are required" });
    }

    let topics = await getTopicsForSubject(subject, studentClass, board);

    if (topics.length === 0) {
      topics = await generateTopicList(subject, studentClass, board);
      await saveTopics(subject, studentClass, board, topics);
    }

    res.json({ topics });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get topics" });
  }
});


app.post("/api/profile", async (req, res) => {
  try {
    const { userId, profileData } = req.body
    if (!userId) return res.status(400).json({ error: "userId is required" })

    const result = await saveUserProfile(userId, profileData)
    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to save profile" })
  }
})

app.get("/api/profile/:userId", async (req, res) => {
  try {
    const profile = await getUserProfile(req.params.userId)
    res.json(profile)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to get profile" })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});