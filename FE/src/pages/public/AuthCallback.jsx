import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getMockUserByRole } from '../../data/mockUsers'

function AuthCallback() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [searchParams] = useSearchParams()
  const hasProcessed = useRef(false)

  useEffect(() => {
    // Prevent running multiple times
    if (hasProcessed.current) return
    hasProcessed.current = true

    // Get role from URL query parameter for testing
    const roleParam = searchParams.get('role') || 'student'
    
    // TODO: Handle SSO callback, extract token, fetch user data
    const mockUser = getMockUserByRole(roleParam)
    
    login(mockUser)
    
    // Use setTimeout to ensure login completes before navigation
    setTimeout(() => {
      // Redirect based on role
      const role = mockUser.roles[0]
      const dashboardRoutes = {
        student: '/student/dashboard',
        tutor: '/tutor/dashboard',
        coordinator: '/coordinator/dashboard',
        academic_affairs: '/academic-affairs/dashboard',
        student_affairs: '/student-affairs/dashboard',
        academic_department: '/academic-department/dashboard'
      }
      
      navigate(dashboardRoutes[role] || '/', { replace: true })
    }, 100)
  }, []) // Empty dependency array - only run once

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Authenticating...</p>
      </div>
    </div>
  )
}

export default AuthCallback
