import { mockUsers } from '../data/mockUsers'

// Helper function for testing login via browser console
// Usage in console: window.testLogin('student')
export const setupTestLogin = () => {
  window.testLogin = (role = 'student') => {
    const validRoles = ['student', 'tutor', 'coordinator', 'academic_affairs', 'student_affairs', 'academic_department']
    
    if (!validRoles.includes(role)) {
      console.error('❌ Invalid role. Valid roles:', validRoles)
      return
    }
    
    console.log('🧪 Test Login:', role)
    window.location.href = `/auth/callback?role=${role}`
  }
  
  window.testLogout = () => {
    localStorage.removeItem('user')
    console.log('👋 Logged out')
    window.location.href = '/'
  }
  
  // Show available commands
  console.log(`
🧪 Test Commands Available:
━━━━━━━━━━━━━━━━━━━━━━━━━━━
testLogin('student')           - Login as Student
testLogin('tutor')             - Login as Tutor  
testLogin('coordinator')       - Login as Coordinator
testLogin('academic_affairs')  - Login as Academic Affairs
testLogin('student_affairs')   - Login as Student Affairs
testLogin('academic_department') - Login as Academic Department
testLogout()                   - Logout current user
━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `)
}
