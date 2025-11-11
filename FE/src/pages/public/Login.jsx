import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import bkLogo from '../../assets/icons/Ho Chi Minh City University of Technology_idnZjcXgHX_1 3.svg'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [selectedRole, setSelectedRole] = useState(null)
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState('')

  const roles = [
    { id: 'student', label: 'Student', color: 'bg-[#0a1f44] hover:bg-[#162d54]' },
    { id: 'tutor', label: 'Tutor', color: 'bg-[#2563eb] hover:bg-[#3b72f5]' },
    { id: 'coordinator', label: 'Coordinator', color: 'bg-[#60a5fa] hover:bg-[#70b5ff]' }
  ]

  const otherStaffRoles = [
    { id: 'academic_affairs', label: 'Academic Affairs' },
    { id: 'student_affairs', label: 'Student Affairs' },
    { id: 'academic_department', label: 'Academic Department' }
  ]

  const handleRoleSelect = (roleId) => {
    if (roleId === 'student' || roleId === 'tutor' || roleId === 'coordinator') {
      setSelectedRole(roleId)
      setShowLoginForm(true)
    } else {
      handleLogin(roleId)
    }
  }

  const handleLogin = (role) => {
    const mockUser = {
      id: '123',
      name: `Test ${role}`,
      email: `test.${role}@hcmut.edu.vn`,
      roles: role === 'coordinator' 
        ? ['coordinator', 'academic_affairs', 'student_affairs', 'academic_department']
        : [role]
    }
    
    login(mockUser)
    
    // Navigate based on role
    const routes = {
      student: '/student/dashboard',
      tutor: '/tutor/dashboard',
      coordinator: '/coordinator/dashboard',
      academic_affairs: '/academic-affairs/dashboard',
      student_affairs: '/student-affairs/dashboard',
      academic_department: '/academic-department/monitor-performance'
    }
    
    navigate(routes[role] || '/')
  }

  const handleBack = () => {
    if (showLoginForm) {
      setShowLoginForm(false)
      setSelectedRole(null)
      setFormData({ username: '', password: '' })
      setError('')
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleFormLogin = (e) => {
    e.preventDefault()
    
    // Simple validation
    if (!formData.username || !formData.password) {
      setError('Please enter both username and password')
      return
    }

    // Mock authentication (in real app, call API here)
    if (formData.username && formData.password) {
      const mockUser = {
        id: '123',
        name: formData.username,
        email: `${formData.username}@hcmut.edu.vn`,
        roles: selectedRole === 'coordinator'
          ? ['coordinator', 'academic_affairs', 'student_affairs', 'academic_department']
          : [selectedRole]
      }
      
      login(mockUser)
      
      // Navigate based on role
      const routes = {
        student: '/student/dashboard',
        tutor: '/tutor/dashboard',
        coordinator: '/coordinator/dashboard'
      }
      navigate(routes[selectedRole] || '/')
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-48 h-48 mb-6">
            <img src={bkLogo} alt="BK Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Hello!</h1>
          <p className="text-gray-600">
            {showLoginForm 
              ? `Login to your ${selectedRole} account` 
              : 'Choose your login option'}
          </p>
        </div>

        {/* Login Options */}
        <div className="space-y-3">
          {showLoginForm ? (
            // Login Form (Student/Tutor)
            <div className="animate-fade-in">
              <form onSubmit={handleFormLogin} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                    placeholder="Enter your username"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                    placeholder="Enter your password"
                  />
                </div>
                {error && (
                  <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  className={`w-full ${
                    selectedRole === 'student' 
                      ? 'bg-[#0a1f44] hover:bg-[#162d54]' 
                      : selectedRole === 'tutor'
                      ? 'bg-[#2563eb] hover:bg-[#3b72f5]'
                      : 'bg-[#60a5fa] hover:bg-[#70b5ff]'
                  } text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200`}
                >
                  Login
                </button>
              </form>
            </div>
          ) : (
            // Main role selection
            <>
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className={`w-full ${role.color} text-white font-medium py-4 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-between group`}
                >
                  <span>{role.label}</span>
                  <svg
                    className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              ))}
              
              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-500">Other Staff</span>
                </div>
              </div>

              {/* Other Staff Roles */}
              {otherStaffRoles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleLogin(role.id)}
                  className="w-full bg-white hover:bg-gray-50 text-blue-900 font-medium py-3 px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between group border border-gray-200"
                >
                  <span className="text-sm">{role.label}</span>
                  <svg
                    className="w-4 h-4 text-blue-600 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              ))}
            </>
          )}
        </div>

        {/* Back Button */}
        {showLoginForm && (
          <button
            onClick={handleBack}
            className="w-full mt-6 text-blue-600 hover:text-blue-800 font-medium py-2 transition-colors"
          >
            ← Back to login options
          </button>
        )}
      </div>
    </div>
  )
}

export default Login
