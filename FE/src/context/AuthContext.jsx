import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Check if user is logged in (from localStorage or API)
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)

    // Expose test login functions to window for console access
    window.testLogin = (role) => {
      const mockUser = {
        id: '123',
        name: `Test ${role}`,
        email: `test@hcmut.edu.vn`,
        roles: [role]
      }
      login(mockUser)
      console.log(`✅ Logged in as: ${role}`, mockUser)
      
      // Auto navigate based on role
      setTimeout(() => {
        if (role === 'academic_department') {
          window.location.href = '/academic-department/monitor-performance'
        } else if (role === 'student') {
          window.location.href = '/student/dashboard'
        } else if (role === 'tutor') {
          window.location.href = '/tutor/dashboard'
        } else if (role === 'coordinator') {
          window.location.href = '/coordinator/dashboard'
        } else if (role === 'academic_affairs') {
          window.location.href = '/academic-affairs/dashboard'
        } else if (role === 'student_affairs') {
          window.location.href = '/student-affairs/dashboard'
        }
        console.log(`🚀 Navigating to dashboard...`)
      }, 100)
    }

    window.testLogout = () => {
      logout()
      console.log('✅ Logged out')
      setTimeout(() => {
        window.location.href = '/'
      }, 100)
    }

    // Log available commands
    console.log('%c🔧 Test Commands Available:', 'color: #3B82F6; font-weight: bold; font-size: 14px')
    console.log('%ctestLogin(\'student\')', 'color: #10B981; font-weight: bold', '- Login as Student')
    console.log('%ctestLogin(\'tutor\')', 'color: #10B981; font-weight: bold', '- Login as Tutor')
    console.log('%ctestLogin(\'coordinator\')', 'color: #10B981; font-weight: bold', '- Login as Coordinator')
    console.log('%ctestLogin(\'academic_affairs\')', 'color: #10B981; font-weight: bold', '- Login as Academic Affairs')
    console.log('%ctestLogin(\'student_affairs\')', 'color: #10B981; font-weight: bold', '- Login as Student Affairs')
    console.log('%ctestLogin(\'academic_department\')', 'color: #10B981; font-weight: bold', '- Login as Academic Department')
    console.log('%ctestLogout()', 'color: #EF4444; font-weight: bold', '- Logout current user')
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    hasRole: (role) => user?.roles?.includes(role)
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
