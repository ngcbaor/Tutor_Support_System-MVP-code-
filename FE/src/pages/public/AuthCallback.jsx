import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function AuthCallback() {
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    // TODO: Handle SSO callback, extract token, fetch user data
    // Mock user for now
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@hcmut.edu.vn',
      roles: ['student'] // or ['tutor'], ['coordinator'], ['academic']
    }
    
    login(mockUser)
    
    // Redirect based on role
    if (mockUser.roles.includes('student')) {
      navigate('/student/dashboard')
    } else if (mockUser.roles.includes('tutor')) {
      navigate('/tutor/dashboard')
    } else if (mockUser.roles.includes('coordinator')) {
      navigate('/coordinator/dashboard')
    } else if (mockUser.roles.includes('academic')) {
      navigate('/academic/dashboard')
    } else {
      navigate('/')
    }
  }, [login, navigate])

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
