// Mock user data for testing different roles
export const mockUsers = {
  student: {
    id: '1',
    name: 'Nguyễn Văn A',
    email: 'student@hcmut.edu.vn',
    roles: ['student'],
    avatar: null
  },
  tutor: {
    id: '2',
    name: 'TS. Trần Thị B',
    email: 'tutor@hcmut.edu.vn',
    roles: ['tutor'],
    avatar: null
  },
  coordinator: {
    id: '3',
    name: 'PGS. Lê Văn C',
    email: 'coordinator@hcmut.edu.vn',
    roles: ['coordinator'],
    avatar: null
  },
  academic_affairs: {
    id: '4',
    name: 'ThS. Phạm Văn D',
    email: 'academic_affairs@hcmut.edu.vn',
    roles: ['academic_affairs'],
    avatar: null
  },
  student_affairs: {
    id: '5',
    name: 'CN. Hoàng Thị E',
    email: 'student_affairs@hcmut.edu.vn',
    roles: ['student_affairs'],
    avatar: null
  },
  academic_department: {
    id: '6',
    name: 'GS. Đỗ Văn F',
    email: 'academic_department@hcmut.edu.vn',
    roles: ['academic_department'],
    avatar: null
  }
}

// Helper function to get mock user by role
export const getMockUserByRole = (role) => {
  return mockUsers[role] || mockUsers.student
}
