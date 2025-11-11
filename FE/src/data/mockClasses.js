// Mock data for tutor's classes
export const mockClasses = [
  {
    id: 'IT4409-1',
    name: 'Advanced Web Programming',
    courseId: 'IT4409',
    group: 'Group 1',
    enrollment: 65,
    time: 'Mon (Period 1-3)',
    color: 'blue'
  },
  {
    id: 'IT4083-2',
    name: 'Distributed Databases',
    courseId: 'IT4083',
    group: 'Group 2',
    enrollment: 48,
    time: 'Tue (Period 7-9)',
    color: 'green'
  },
  {
    id: 'CS1010-5',
    name: 'Intro to Artificial Intelligence',
    courseId: 'CS1010',
    group: 'Group 5',
    enrollment: 112,
    time: 'Thu (Period 1-3)',
    color: 'orange'
  }
]

// Mock data for students in a class
export const mockStudents = [
  {
    id: '2352109',
    name: 'Trần Ngọc Bảo',
    email: 'bao.tran23@hcmut.edu.vn',
    avatar: 'TB',
    avatarColor: 'bg-blue-600',
    lastUpdate: '2025-10-24',
    status: 'recent', // recent, none, old
    overallScore: 4.1,
    totalSessions: 2
  },
  {
    id: '2352237',
    name: 'Nguyễn Thành Đạt',
    email: 'dat.nguyen23@hcmut.edu.vn',
    avatar: 'TD',
    avatarColor: 'bg-orange-600',
    lastUpdate: '2025-10-22',
    status: 'recent',
    overallScore: 3.8,
    totalSessions: 3
  },
  {
    id: '2352636',
    name: 'Nguyễn Thế Anh',
    email: 'theanh23@hcmut.edu.vn',
    avatar: 'TA',
    avatarColor: 'bg-blue-500',
    lastUpdate: null,
    status: 'none',
    overallScore: null,
    totalSessions: 0
  },
  {
    id: '2352053',
    name: 'Nguyễn Thiên Anh',
    email: 'anh.nguyen23@hcmut.edu.vn',
    avatar: 'TA',
    avatarColor: 'bg-blue-500',
    lastUpdate: null,
    status: 'none',
    overallScore: null,
    totalSessions: 0
  },
  {
    id: '2352614',
    name: 'Cao Nguyễn Gia Khánh',
    email: 'khanh.cao23@hcmut.edu.vn',
    avatar: 'GK',
    avatarColor: 'bg-purple-600',
    lastUpdate: null,
    status: 'none',
    overallScore: null,
    totalSessions: 0
  },
  {
    id: '2352641',
    name: 'Mai Trung Kiên',
    email: 'kien.mai23@hcmut.edu.vn',
    avatar: 'TK',
    avatarColor: 'bg-pink-600',
    lastUpdate: '2025-10-15',
    status: 'old',
    overallScore: 3.5,
    totalSessions: 1
  },
  {
    id: '2352931',
    name: 'Lê Nguyễn Gia Phúc',
    email: 'phuc.le23@hcmut.edu.vn',
    avatar: 'GP',
    avatarColor: 'bg-green-600',
    lastUpdate: '2025-10-24',
    status: 'recent',
    overallScore: 4.5,
    totalSessions: 4
  }
]

// Mock progress notes for a student
export const mockProgressNotes = [
  {
    id: 1,
    studentId: '2352109',
    date: '2025-10-24',
    author: 'TS. Trần Thị B',
    comment: 'Bao showed excellent understanding of React Hooks this session. Struggled slightly with async state management, but grasped the concept after a review. Homework was complete and well-done.',
    rubrics: {
      topicMastery: 4,
      problemSolving: 3,
      participation: 5,
      studySkills: 4,
      homework: 5
    },
    evidence: [
      { name: 'async_review.pdf', type: 'pdf' },
      { name: 'homework_ss.png', type: 'image' }
    ]
  },
  {
    id: 2,
    studentId: '2352109',
    date: '2025-10-15',
    author: 'TS. Trần Thị B',
    comment: 'Good progress on basic CSS flexbox. Needs to review grid layouts for next time. Participation was a bit low today.',
    rubrics: {
      topicMastery: 3,
      problemSolving: 3,
      participation: 2,
      studySkills: 3,
      homework: 4
    },
    evidence: []
  }
]

export const getStudentById = (id) => {
  return mockStudents.find(s => s.id === id)
}

export const getProgressNotesByStudentId = (studentId) => {
  return mockProgressNotes.filter(n => n.studentId === studentId)
}

export const calculateAverageRubrics = (notes) => {
  if (!notes || notes.length === 0) return null
  
  const totals = {
    topicMastery: 0,
    problemSolving: 0,
    participation: 0,
    studySkills: 0,
    homework: 0
  }
  
  notes.forEach(note => {
    Object.keys(totals).forEach(key => {
      totals[key] += note.rubrics[key]
    })
  })
  
  const count = notes.length
  return {
    topicMastery: (totals.topicMastery / count).toFixed(1),
    problemSolving: (totals.problemSolving / count).toFixed(1),
    participation: (totals.participation / count).toFixed(1),
    studySkills: (totals.studySkills / count).toFixed(1),
    homework: (totals.homework / count).toFixed(1)
  }
}
