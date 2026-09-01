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
    .eq('student_class', studentClass)
    .eq('board', board)

  if (error) throw error
  return data.map((row) => row.topic_name)
}

export async function saveTopics(subject, studentClass, board, topicNames) {
  const rows = topicNames.map((name) => ({
    subject_name: subject,
    student_class: studentClass,
    board: board,
    topic_name: name,
  }))

  const { error } = await supabase.from('topics').insert(rows)
  if (error) throw error
}

export async function saveUserProfile(userId, profileData) {
  const { name, studentClass, board, subjects, favouriteSubjects, learningStyle, interests, strengths, examDate, hoursPerDay } = profileData

  const { error: userError } = await supabase
    .from('users')
    .upsert({
      id: userId,
      name,
      student_class: studentClass,
      board,
      learning_style: learningStyle,
      interests,
      exam_date: examDate || null,
      hours_per_day: hoursPerDay,
    })

  if (userError) throw userError

  // Save subjects separately (delete old ones first, in case of re-onboarding)
  await supabase.from('user_subjects').delete().eq('user_id', userId)

  const subjectRows = subjects.map((s) => ({ user_id: userId, subject_name: s }))
  const { error: subjectError } = await supabase.from('user_subjects').insert(subjectRows)
  if (subjectError) throw subjectError

  return { success: true }
}

export async function getUserProfile(userId) {
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (userError) throw userError

  const { data: subjects, error: subjectError } = await supabase
    .from('user_subjects')
    .select('subject_name')
    .eq('user_id', userId)

  if (subjectError) throw subjectError

  return {
    ...user,
    subjects: subjects.map((s) => s.subject_name),
  }
}