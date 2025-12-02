import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
// import apiClient from '../services/apiClient' // Uncomment when backend is ready
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
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen)
  }

  const handleProfileNavigate = () => {
    const role = user?.roles?.[0]
    navigate(`/${role}/profile`)
    setIsProfileDropdownOpen(false)
  }

  const handleLogoutClick = () => {
    setIsProfileDropdownOpen(false)
    handleLogout()
  }

  // Fetch notifications
  const fetchNotifications = async () => {
    setIsLoadingNotifications(true)
    try {
      // BACKEND INTEGRATION POINT
      // Uncomment this when your backend API is ready:
      /*
      const response = await apiClient.get('/notifications')
      setNotifications(response.data)
      */

      // Mock notifications - Remove this when backend is ready
      await new Promise(resolve => setTimeout(resolve, 500))
      const mockNotifications = [
        {
          id: 1,
          title: 'New Assignment',
          message: 'New assignment posted in Computer Science',
          timestamp: '2 hours ago',
          isRead: false,
          type: 'assignment'
        },
        {
          id: 2,
          title: 'Grade Updated',
          message: 'Your grade for Math 101 has been updated',
          timestamp: '5 hours ago',
          isRead: false,
          type: 'grade'
        },
        {
          id: 3,
          title: 'Class Reminder',
          message: 'Your class starts in 30 minutes',
          timestamp: '1 day ago',
          isRead: true,
          type: 'reminder'
        },
        {
          id: 4,
          title: 'New Message',
          message: 'You have a new message from your tutor',
          timestamp: '2 days ago',
          isRead: true,
          type: 'message'
        }
      ]
      setNotifications(mockNotifications)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setIsLoadingNotifications(false)
    }
  }

  // Toggle notification dropdown and fetch if opening
  const handleNotificationClick = () => {
    if (!isNotificationOpen) {
      fetchNotifications()
    }
    setIsNotificationOpen(!isNotificationOpen)
  }

  // Mark notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      // BACKEND INTEGRATION POINT
      // Uncomment this when your backend API is ready:
      /*
      await apiClient.patch(`/notifications/${notificationId}/read`)
      */

      // Mock - Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      )
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  // Delete notification
  const handleDeleteNotification = async (notificationId) => {
    try {
      // BACKEND INTEGRATION POINT
      // Uncomment this when your backend API is ready:
      /*
      await apiClient.delete(`/notifications/${notificationId}`)
      */

      // Mock - Update local state
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  // Get unread count
  const unreadCount = notifications.filter(n => !n.isRead).length

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
        { path: '/coordinator/manage-schedule', label: 'Schedule Management', icon: timetableIcon }
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
              <div className="relative">
                <button 
                  onClick={handleNotificationClick}
                  className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-semibold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {isNotificationOpen && (
                  <>
                    {/* Overlay to close dropdown when clicking outside */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsNotificationOpen(false)}
                    />
                    
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[500px] flex flex-col">
                      {/* Header */}
                      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="text-xs text-blue-600 font-medium">
                            {unreadCount} unread
                          </span>
                        )}
                      </div>

                      {/* Notifications List */}
                      <div className="overflow-y-auto flex-1">
                        {isLoadingNotifications ? (
                          <div className="flex items-center justify-center py-8">
                            <svg className="animate-spin h-6 w-6 text-blue-600" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          </div>
                        ) : notifications.length === 0 ? (
                          <div className="py-8 text-center text-gray-500 text-sm">
                            No notifications
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-100">
                            {notifications.map((notification) => (
                              <div
                                key={notification.id}
                                className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer relative group ${
                                  !notification.isRead ? 'bg-blue-50' : ''
                                }`}
                                onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                              >
                                <div className="flex items-start gap-3">
                                  {/* Icon based on type */}
                                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                    notification.type === 'assignment' ? 'bg-blue-100' :
                                    notification.type === 'grade' ? 'bg-green-100' :
                                    notification.type === 'reminder' ? 'bg-yellow-100' :
                                    'bg-purple-100'
                                  }`}>
                                    {notification.type === 'assignment' && (
                                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                    )}
                                    {notification.type === 'grade' && (
                                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                    )}
                                    {notification.type === 'reminder' && (
                                      <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                    )}
                                    {notification.type === 'message' && (
                                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                      </svg>
                                    )}
                                  </div>

                                  {/* Content */}
                                  <div className="flex-1 min-w-0 pr-8">
                                    <div className="flex items-center gap-2">
                                      <p className={`text-sm font-medium text-gray-900 ${!notification.isRead ? 'font-semibold' : ''}`}>
                                        {notification.title}
                                      </p>
                                      {!notification.isRead && (
                                        <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full"></span>
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                                      {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                      {notification.timestamp}
                                    </p>
                                  </div>

                                  {/* Delete Button */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleDeleteNotification(notification.id)
                                    }}
                                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                                    title="Delete notification"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      {notifications.length > 0 && (
                        <div className="px-4 py-3 border-t border-gray-200">
                          <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                            View All Notifications
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="hidden sm:block relative">
                <button 
                  onClick={handleProfileClick}
                  className="flex items-center gap-2 lg:gap-3 pl-2 lg:pl-4 border-l border-gray-200 hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-xs lg:text-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden md:flex flex-col">
                    <span className="text-sm font-medium text-gray-900">{user?.name || 'User'}</span>
                    <span className="text-xs text-gray-500 capitalize">{user?.roles?.[0]?.replace('_', ' ') || 'User'}</span>
                  </div>
                  <svg 
                    className={`w-5 h-5 text-gray-400 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <>
                    {/* Overlay to close dropdown when clicking outside */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsProfileDropdownOpen(false)}
                    />
                    
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <button
                        onClick={handleProfileNavigate}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogoutClick}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </>
                )}
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
