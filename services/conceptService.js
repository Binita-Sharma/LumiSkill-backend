import { askGemini } from './aiService.js'

export async function generateConcept(topic, studentProfile) {
  const { name, interests, favouriteSubjects, learningStyle } = studentProfile

  const prompt = `You are Lumi, a friendly AI tutor for school students (class 6-10).

A student named ${name} wants to understand the concept: "${topic}"

About the student:
- Their hobbies/interests: ${interests?.join(', ') || 'not specified'}
- Their favourite subjects: ${favouriteSubjects?.join(', ') || 'not specified'}
- Their learning style: ${learningStyle || 'not specified'}

Your task: Explain "${topic}" using a simple, relatable STORY or ANALOGY that connects to the student's interests above. Avoid textbook language. Make it feel like a friend explaining it, not a teacher lecturing.

Then also provide:
1. A short "textbook definition" version (1-2 sentences, exam-ready)
2. A simple description of a diagram that would help visualize this concept (describe shapes, arrows, labels - keep it simple enough to draw as a basic diagram)

Respond ONLY in this exact JSON format, no extra text before or after:
{
  "story": "the story/analogy explanation here",
  "definition": "the textbook definition here",
  "diagramDescription": "description of a simple diagram here"
}`

  const rawResponse = await askGemini(prompt)

  // Clean up response in case Gemini wraps it in markdown code fences
  const cleaned = rawResponse.replace(/```json|```/g, '').trim()

  try {
    return JSON.parse(cleaned)
  } catch (err) {
    console.error('Failed to parse AI response:', cleaned)
    throw new Error('AI response was not valid JSON')
  }
}

export async function generateTopicList(subject, studentClass, board) {
  const prompt = `List the main chapters/topics typically taught in "${subject}" for Class ${studentClass} under the ${board} board in India.

Return ONLY a JSON array of chapter names, nothing else, no extra text. Keep names short (2-5 words each). Example format:
["Chapter One", "Chapter Two", "Chapter Three"]

Give around 8-12 chapters, in the typical order they'd be taught.`

  const rawResponse = await askGemini(prompt)
  const cleaned = rawResponse.replace(/```json|```/g, '').trim()

  try {
    return JSON.parse(cleaned)
  } catch (err) {
    console.error('Failed to parse topic list:', cleaned)
    throw new Error('AI topic list response was not valid JSON')
  }
}