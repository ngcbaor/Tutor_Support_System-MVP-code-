// Mock data for tutoring sessions and schedule
export const mockSessions = [
  {
    id: 'session-1',
    courseCode: 'CS 1R2',
    courseName: 'Web Exploitation',
    instructor: 'Dr. Le Nguyen Bao Minh',
    room: 'SF 13',
    date: '2025-05-16',
    startTime: '08:00',
    endTime: '10:00',
    timeDisplay: '08:00 AM',
    chapter: 'Chapter 4',
    topic: 'Prototype Pollution in Javascript',
    status: 'scheduled',
    color: 'purple'
  },
  {
    id: 'session-2',
    courseCode: 'CS 1R2',
    courseName: 'Reverse Engineering',
    instructor: 'Dr. Tran Minh Duc',
    room: 'SF 13',
    date: '2025-05-16',
    startTime: '10:30',
    endTime: '12:30',
    timeDisplay: '10:30 AM',
    chapter: 'Chapter 6',
    topic: 'Binary Analysis Techniques',
    status: 'scheduled',
    color: 'blue'
  },
  {
    id: 'session-3',
    courseCode: 'CS 1B9',
    courseName: 'Binary Exploitation',
    instructor: 'Dr. Nguyen Van Hieu',
    room: 'SF 13',
    date: '2025-05-16',
    startTime: '13:00',
    endTime: '15:00',
    timeDisplay: '01:00 PM',
    chapter: 'Chapter 3',
    topic: 'Stack-based Buffer Overflow',
    status: 'postponed',
    color: 'green'
  },
  {
    id: 'session-4',
    courseCode: 'CS 1',
    courseName: 'Cryptography',
    instructor: 'Dr. Pham Hoang Anh',
    room: 'SF 13',
    date: '2025-05-16',
    startTime: '14:00',
    endTime: '16:00',
    timeDisplay: '02:00 PM',
    chapter: 'Chapter 5',
    topic: 'RSA and Public Key Cryptography',
    status: 'scheduled',
    color: 'yellow'
  },
  // Additional sessions for different dates
  {
    id: 'session-5',
    courseCode: 'CS 1R2',
    courseName: 'Circuit Theory',
    instructor: 'Dr. Hoang Minh Tu',
    room: 'SF 15',
    date: '2025-05-13',
    startTime: '08:00',
    endTime: '10:00',
    timeDisplay: '08:00 AM',
    chapter: 'Chapter 2',
    topic: 'AC Circuit Analysis',
    status: 'scheduled',
    color: 'purple'
  },
  {
    id: 'session-6',
    courseCode: 'CS 1R2',
    courseName: 'Circuit Theory',
    instructor: 'Dr. Hoang Minh Tu',
    room: 'SF 15',
    date: '2025-05-14',
    startTime: '10:30',
    endTime: '12:30',
    timeDisplay: '10:30 AM',
    chapter: 'Chapter 2',
    topic: 'DC Circuit Fundamentals',
    status: 'scheduled',
    color: 'blue'
  },
  {
    id: 'session-7',
    courseCode: 'CS 1R2',
    courseName: 'Circuit Theory',
    instructor: 'Dr. Hoang Minh Tu',
    room: 'SF 15',
    date: '2025-05-15',
    startTime: '13:00',
    endTime: '15:00',
    timeDisplay: '01:00 PM',
    chapter: 'Chapter 3',
    topic: 'Transistor Applications',
    status: 'scheduled',
    color: 'green'
  }
]

// Mock upcoming events
export const mockUpcomingEvents = [
  {
    id: 'event-1',
    title: 'Level-Up Seminar',
    date: '2025-05-31',
    time: '10:00 AM',
    type: 'seminar'
  },
  {
    id: 'event-2',
    title: 'Innovation Fair',
    date: '2025-06-13',
    time: '9:00 AM',
    type: 'fair'
  },
  {
    id: 'event-3',
    title: 'College Elections',
    date: '2025-06-19',
    startTime: '8:00 AM',
    endTime: '5:00 PM',
    type: 'election'
  }
]

// Helper function to get sessions by date
export const getSessionsByDate = (date) => {
  return mockSessions.filter(session => session.date === date)
}

// Helper function to get sessions for a date range
export const getSessionsInRange = (startDate, endDate) => {
  return mockSessions.filter(session => {
    const sessionDate = new Date(session.date)
    return sessionDate >= new Date(startDate) && sessionDate <= new Date(endDate)
  })
}
