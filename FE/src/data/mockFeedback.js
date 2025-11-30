// Mock feedback data and helpers (will be replaced by API later)
// Each item can be a completed course or a recent tutoring session.

// Courses student has completed
export const completedCourses = [
  {
    id: 'course-software-eng',
    type: 'course',
    code: 'CO3001',
    name: 'Software Engineering',
    tutor: 'Nguyen Van A',
    reviewsCount: 34,
    avgRating: 4.9
  },
  // Add additional completed courses here as needed
]

// Recent tutoring sessions (some may already have feedback)
export const recentSessions = [
  {
    id: 'sess-web-exploitation',
    type: 'session',
    courseCode: 'CS 162',
    title: 'Web Exploitation',
    date: '2025-10-26',
    startTime: '08:00',
    tutor: 'Nguyen Van A'
  },
  {
    id: 'sess-reverse-engineering',
    type: 'session',
    courseCode: 'CS 152',
    title: 'Reverse Engineering',
    date: '2025-10-25',
    startTime: '10:30',
    tutor: 'Nguyen Van A'
  },
  {
    id: 'sess-binary-exploitation',
    type: 'session',
    courseCode: 'CS 169',
    title: 'Binary Exploitation',
    date: '2025-10-25',
    startTime: '13:00',
    tutor: 'Nguyen Van A'
  },
  {
    id: 'sess-cryptography',
    type: 'session',
    courseCode: 'CS 1',
    title: 'Cryptography',
    date: '2025-10-25',
    startTime: '14:00',
    tutor: 'Nguyen Van A'
  }
]

// Local storage key
const STORAGE_KEY = 'feedbackEntries'

function loadAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function saveAll(map) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
}

export function getFeedbackById(id) {
  const all = loadAll()
  return all[id] || null
}

export function saveFeedback(id, data) {
  const all = loadAll()
  all[id] = { ...data, submittedAt: new Date().toISOString() }
  saveAll(all)
  return all[id]
}

export function hasFeedback(id) {
  return !!getFeedbackById(id)
}

// Helper to count words (used for validation)
export function countWords(text) {
  if (!text) return 0
  return text.trim().split(/\s+/).filter(Boolean).length
}

// Aggregate lookup (course + sessions)
export function getItemById(id) {
  return completedCourses.find(c => c.id === id) || recentSessions.find(s => s.id === id) || null
}
