import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export async function getTopicsForSubject(subject, studentClass, board) {
  const { data, error } = await supabase
    .from('topics')
    .select('topic_name')
    .eq('subject_name', subject)
    // Note: we'll refine this query once we add class/board columns to the topics table

  if (error) throw error
  return data.map((row) => row.topic_name)
}

export async function saveTopics(subject, topicNames) {
  const rows = topicNames.map((name) => ({
    subject_name: subject,
    topic_name: name,
  }))

  const { error } = await supabase.from('topics').insert(rows)
  if (error) throw error
}