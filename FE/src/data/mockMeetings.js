// Mock data for meetings and meeting records
export const mockMeetings = [
  {
    id: 'meeting-1',
    courseCode: 'CS 1R2',
    courseName: 'Web Exploitation',
    date: '2025-05-16',
    startTime: '08:00',
    endTime: '10:00',
    room: 'SF 13',
    topic: 'Prototype Pollution in Javascript',
    chapter: 'Chapter 4',
    students: [
      { id: '2352109', name: 'Trần Ngọc Bảo', attended: true },
      { id: '2352237', name: 'Nguyễn Thành Đạt', attended: true },
      { id: '2352636', name: 'Nguyễn Thế Anh', attended: false }
    ],
    hasRecord: true,
    record: {
      summary: 'Covered prototype pollution vulnerabilities in JavaScript. Students demonstrated good understanding of the attack vectors.',
      topicsCovered: ['Prototype chain basics', 'Pollution techniques', 'Real-world examples'],
      studentProgress: 'Most students grasped the concepts well. Need follow-up on practical exploitation.',
      nextSteps: 'Lab assignment on finding prototype pollution bugs',
      attendance: '2/3 students attended',
      lastUpdated: '2025-05-16T10:15:00'
    }
  },
  {
    id: 'meeting-2',
    courseCode: 'CS 1R2',
    courseName: 'Reverse Engineering',
    date: '2025-05-16',
    startTime: '10:30',
    endTime: '12:30',
    room: 'SF 13',
    topic: 'Binary Analysis Techniques',
    chapter: 'Chapter 6',
    students: [
      { id: '2352109', name: 'Trần Ngọc Bảo', attended: true },
      { id: '2352237', name: 'Nguyễn Thành Đạt', attended: true },
      { id: '2352636', name: 'Nguyễn Thế Anh', attended: true },
      { id: '2352641', name: 'Mai Trung Kiên', attended: true }
    ],
    hasRecord: false,
    record: null
  },
  {
    id: 'meeting-3',
    courseCode: 'CS 1B9',
    courseName: 'Binary Exploitation',
    date: '2025-05-15',
    startTime: '13:00',
    endTime: '15:00',
    room: 'SF 13',
    topic: 'Stack-based Buffer Overflow',
    chapter: 'Chapter 3',
    students: [
      { id: '2352109', name: 'Trần Ngọc Bảo', attended: true },
      { id: '2352237', name: 'Nguyễn Thành Đạt', attended: false }
    ],
    hasRecord: true,
    record: {
      summary: 'Introduced stack-based buffer overflow attacks. Students practiced with simple examples.',
      topicsCovered: ['Stack layout', 'Return address overwrite', 'Payload construction'],
      studentProgress: 'Good engagement. Students need more practice with shellcode.',
      nextSteps: 'Practice exercises on buffer overflow exploitation',
      attendance: '1/2 students attended',
      lastUpdated: '2025-05-15T15:10:00'
    }
  },
  {
    id: 'meeting-4',
    courseCode: 'CS 1',
    courseName: 'Cryptography',
    date: '2025-05-14',
    startTime: '14:00',
    endTime: '16:00',
    room: 'SF 13',
    topic: 'RSA and Public Key Cryptography',
    chapter: 'Chapter 5',
    students: [
      { id: '2352109', name: 'Trần Ngọc Bảo', attended: true },
      { id: '2352636', name: 'Nguyễn Thế Anh', attended: true },
      { id: '2352641', name: 'Mai Trung Kiên', attended: true }
    ],
    hasRecord: false,
    record: null
  }
]

// Get meetings by date range
export const getMeetingsByDateRange = (startDate, endDate) => {
  return mockMeetings.filter(meeting => {
    const meetingDate = new Date(meeting.date)
    return meetingDate >= new Date(startDate) && meetingDate <= new Date(endDate)
  })
}

// Get meetings that need records
export const getMeetingsNeedingRecords = () => {
  return mockMeetings.filter(meeting => !meeting.hasRecord)
}

// Get meeting by ID
export const getMeetingById = (id) => {
  return mockMeetings.find(meeting => meeting.id === id)
}

// Validate meeting record
export const validateMeetingRecord = (record) => {
  const errors = {}
  
  if (!record.summary || record.summary.trim().length < 10) {
    errors.summary = 'Summary must be at least 10 characters'
  }
  
  if (!record.topicsCovered || record.topicsCovered.length === 0) {
    errors.topicsCovered = 'Please list at least one topic covered'
  }
  
  if (!record.studentProgress || record.studentProgress.trim().length < 10) {
    errors.studentProgress = 'Student progress notes must be at least 10 characters'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
