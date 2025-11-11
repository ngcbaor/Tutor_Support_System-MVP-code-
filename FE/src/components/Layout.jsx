import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import hcmutLogo from '../assets/icons/Ho Chi Minh City University of Technology_idnZjcXgHX_1 3.svg'
import dashboardIcon from '../assets/icons/dashboard.svg'
import profileIcon from '../assets/icons/profile.svg'
import timetableIcon from '../assets/icons/timetable.svg'
import classIcon from '../assets/icons/class.svg'
import resourcesIcon from '../assets/icons/resources.svg'
import registrationIcon from '../assets/icons/registration.svg'
import feedbackIcon from '../assets/icons/feedback.svg'
import performanceIcon from '../assets/icons/performance.svg'
import createReportIcon from '../assets/icons/createreport.svg'
import reportListIcon from '../assets/icons/reportlist.svg'

function Layout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Navigation items based on role
  const getNavItems = () => {
    const role = user?.roles?.[0]
    
    const roleBasedItems = {
      student: [
        { path: '/student/dashboard', label: 'Dashboard', icon: dashboardIcon },
        { path: '/student/profile', label: 'Profile', icon: profileIcon },
        { path: '/student/registration', label: 'Registration', icon: registrationIcon },
        { path: '/student/timetable', label: 'Timetable', icon: timetableIcon },
        { path: '/student/feedback', label: 'Feedback', icon: feedbackIcon },
        { path: '/student/resources', label: 'Resources', icon: resourcesIcon }
      ],
      tutor: [
        { path: '/tutor/dashboard', label: 'Dashboard', icon: dashboardIcon },
        { path: '/tutor/profile', label: 'Profile', icon: profileIcon },
        { path: '/tutor/timetable', label: 'Timetable', icon: timetableIcon },
        { path: '/tutor/class', label: 'Class', icon: classIcon },
        { path: '/tutor/resources', label: 'Resources', icon: resourcesIcon }
      ],
      coordinator: [
        { path: '/coordinator/dashboard', label: 'Dashboard', icon: dashboardIcon },
        { path: '/coordinator/profile', label: 'Profile', icon: profileIcon },
        { path: '/coordinator/registration', label: 'Registration Management', icon: registrationIcon },
        { path: '/coordinator/schedule', label: 'Schedule Management', icon: timetableIcon }
      ],
      academic_affairs: [
        { path: '/academic-affairs/dashboard', label: 'Dashboard', icon: dashboardIcon },
        { path: '/academic-affairs/profile', label: 'Profile', icon: profileIcon },
        { path: '/academic-affairs/generate-overview-report', label: 'Generate Report', icon: createReportIcon },
        { path: '/academic-affairs/report-list', label: 'Report List', icon: reportListIcon }
      ],
      student_affairs: [
        { path: '/student-affairs/dashboard', label: 'Dashboard', icon: dashboardIcon },
        { path: '/student-affairs/profile', label: 'Profile', icon: profileIcon },
        { path: '/student-affairs/report-list', label: 'Report List', icon: reportListIcon }
      ],
      academic_department: [
        { path: '/academic-department/performance', label: 'Performance', icon: performanceIcon },
        { path: '/academic-department/profile', label: 'Profile', icon: profileIcon }
      ]
    }

    return roleBasedItems[role] || []
  }

  const navItems = getNavItems()

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 lg:w-56 bg-linear-to-b from-gray-50 to-white 
        border-r border-gray-200 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-4 lg:p-6 flex flex-col items-center border-b border-gray-200 lg:border-0">
          <img src={hcmutLogo} alt="BK Logo" className="h-12 lg:h-16 w-12 lg:w-16 mb-2 lg:mb-3" />
          <div className="text-center">
            <span className="block text-base lg:text-lg font-bold text-blue-900">TutorSupport</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                }`}
              >
                <img 
                  src={item.icon} 
                  alt={item.label}
                  className={`w-5 h-5 ${isActive ? 'nav-icon-active' : 'nav-icon-inactive'}`}
                />
                <span className={`text-sm font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* User Info (optional, at bottom) */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            {user?.name || 'User'}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-3 lg:py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Hamburger Menu (Mobile) */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Page Title / Date */}
            <div className="flex-1 min-w-0">
              <h1 className="text-lg lg:text-xl font-semibold text-gray-900 truncate">
                {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
              </h1>
              <p className="text-xs lg:text-sm text-gray-500 hidden sm:block">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            {/* Right side - Notifications & Profile */}
            <div className="flex items-center gap-2 lg:gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile Dropdown */}
              <div className="hidden sm:flex items-center gap-2 lg:gap-3 pl-2 lg:pl-4 border-l border-gray-200">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-xs lg:text-sm">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="hidden md:flex flex-col">
                  <span className="text-sm font-medium text-gray-900">{user?.name || 'User'}</span>
                  <span className="text-xs text-gray-500 capitalize">{user?.roles?.[0]?.replace('_', ' ') || 'User'}</span>
                </div>
                <button className="text-gray-400 hover:text-gray-600" onClick={handleLogout}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              
              {/* Mobile Profile Icon */}
              <button 
                onClick={handleLogout}
                className="sm:hidden w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-xs"
              >
                {user?.name?.charAt(0) || 'U'}
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-50 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
