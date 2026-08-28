import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function askGemini(prompt) {
  const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' })
  const result = await model.generateContent(prompt)
  const response = result.response
  return response.text()
}