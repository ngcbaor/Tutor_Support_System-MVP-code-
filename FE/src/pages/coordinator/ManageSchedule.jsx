import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { mockSessions, mockUpcomingEvents } from '../../data/mockSessions'

function ManageSchedule() {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 4, 16)) // May 16, 2025
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 4, 1))
  const [selectedSession, setSelectedSession] = useState(null)
  const [sessions, setSessions] = useState([])
  const [filterTutor, setFilterTutor] = useState('all')
  const [filterCourse, setFilterCourse] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  // Get unique tutors and courses for filters
  const tutors = ['all', ...new Set(mockSessions.map(s => s.instructor))]
  const courses = ['all', ...new Set(mockSessions.map(s => s.courseCode))]
  const statuses = ['all', 'scheduled', 'postponed', 'cancelled']

  useEffect(() => {
    // Filter sessions by selected date and filters
    const dateStr = selectedDate.toISOString().split('T')[0]
    let filtered = mockSessions.filter(session => session.date === dateStr)
    
    if (filterTutor !== 'all') {
      filtered = filtered.filter(s => s.instructor === filterTutor)
    }
    if (filterCourse !== 'all') {
      filtered = filtered.filter(s => s.courseCode === filterCourse)
    }
    if (filterStatus !== 'all') {
      filtered = filtered.filter(s => s.status === filterStatus)
    }
    
    setSessions(filtered)
  }, [selectedDate, filterTutor, filterCourse, filterStatus])

  const getColorClasses = (color) => {
    const colorMap = {
      purple: 'bg-purple-100 text-purple-800 border-purple-300',
      blue: 'bg-blue-100 text-blue-800 border-blue-300',
      green: 'bg-green-100 text-green-800 border-green-300',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      red: 'bg-red-100 text-red-800 border-red-300'
    }
    return colorMap[color] || 'bg-gray-100 text-gray-800 border-gray-300'
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      scheduled: { variant: 'success', text: 'Scheduled' },
      postponed: { variant: 'warning', text: 'Postponed' },
      cancelled: { variant: 'danger', text: 'Cancelled' }
    }
    const statusInfo = statusMap[status] || { variant: 'default', text: status }
    return <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>
  }

  const formatDateForDisplay = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    return days
  }

  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false
    return date1.toDateString() === date2.toDateString()
  }

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const handleDateClick = (date) => {
    setSelectedDate(date)
  }

  const handleSessionClick = (session) => {
    setSelectedSession(session)
  }

  const handleViewDetails = () => {
    if (selectedSession) {
      // Navigate to session details page
      navigate(`/coordinator/session/${selectedSession.id}`)
    }
  }

  const getWeekDates = () => {
    const dates = []
    const startDate = new Date(selectedDate)
    const dayOfWeek = startDate.getDay()
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    startDate.setDate(startDate.getDate() + diff)
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const calendarDays = getDaysInMonth(currentMonth)
  const weekDates = getWeekDates()

  // Get statistics
  const totalSessions = mockSessions.length
  const scheduledSessions = mockSessions.filter(s => s.status === 'scheduled').length
  const postponedSessions = mockSessions.filter(s => s.status === 'postponed').length

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Schedule</h1>
            <p className="text-gray-600 mt-1">Overview and management of all tutoring schedules</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{totalSessions}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-green-600">{scheduledSessions}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Postponed</p>
                <p className="text-2xl font-bold text-yellow-600">{postponedSessions}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left side - Session details */}
          {selectedSession && (
            <div className="lg:col-span-1 order-2 lg:order-1">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Session Details</h3>
                  {getStatusBadge(selectedSession.status)}
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Course</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedSession.courseCode} - {selectedSession.courseName}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Tutor</p>
                    <p className="text-sm text-gray-900">{selectedSession.instructor}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Date & Time</p>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedSession.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="text-sm text-gray-900">
                      {selectedSession.startTime} - {selectedSession.endTime}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Location</p>
                    <p className="text-sm text-gray-900">{selectedSession.room}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Topic</p>
                    <p className="text-sm text-gray-900">{selectedSession.chapter}</p>
                    <p className="text-sm text-gray-600">{selectedSession.topic}</p>
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    <Button
                      variant="primary"
                      className="w-full"
                      onClick={handleViewDetails}
                    >
                      View Full Details
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Upcoming Events */}
              <Card className="p-6 mt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Upcoming Events</h3>
                <div className="space-y-3">
                  {mockUpcomingEvents.slice(0, 3).map((event) => (
                    <div key={event.id} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${
                        event.type === 'meeting' ? 'bg-blue-500' : 'bg-green-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{event.title}</p>
                        <p className="text-xs text-gray-600">{event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* Right side - Calendar and week view */}
          <div className={selectedSession ? "lg:col-span-2 order-1 lg:order-2" : "lg:col-span-3"}>
            <Card className="p-6">
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Tutor
                  </label>
                  <select
                    value={filterTutor}
                    onChange={(e) => setFilterTutor(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    {tutors.map(tutor => (
                      <option key={tutor} value={tutor}>
                        {tutor === 'all' ? 'All Tutors' : tutor}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Course
                  </label>
                  <select
                    value={filterCourse}
                    onChange={(e) => setFilterCourse(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    {courses.map(course => (
                      <option key={course} value={course}>
                        {course === 'all' ? 'All Courses' : course}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>
                        {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Calendar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={handlePreviousMonth} className="p-1 hover:bg-gray-100 rounded">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {formatDateForDisplay(currentMonth)}
                  </h3>
                  <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekDays.map((day, index) => (
                    <div
                      key={index}
                      className={`text-xs font-medium text-center py-2 ${
                        index >= 5 ? 'text-red-500' : 'text-white'
                      } bg-blue-900 rounded`}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((date, index) => {
                    if (!date) {
                      return <div key={`empty-${index}`} className="aspect-square" />
                    }

                    const isSelected = isSameDay(date, selectedDate)
                    const dateStr = date.toISOString().split('T')[0]
                    const hasEvents = mockSessions.some(s => s.date === dateStr)

                    return (
                      <button
                        key={index}
                        onClick={() => handleDateClick(date)}
                        className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-colors relative ${
                          isSelected
                            ? 'bg-blue-900 text-white font-semibold ring-2 ring-blue-500'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {date.getDate()}
                        {hasEvents && !isSelected && (
                          <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Week View */}
              <div className="border-t pt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Week of {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </h3>

                <div className="grid grid-cols-7 gap-2">
                  {weekDates.map((date, index) => {
                    const isSelected = isSameDay(date, selectedDate)
                    return (
                      <div
                        key={index}
                        className={`text-center ${isSelected ? 'bg-blue-50 rounded-lg p-2' : 'p-2'}`}
                      >
                        <p className={`text-xs font-medium mb-2 ${
                          isSelected ? 'text-blue-900' : 'text-gray-600'
                        }`}>
                          {date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </p>
                        <p className={`text-sm font-semibold mb-2 ${
                          isSelected ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {date.getDate()}
                        </p>
                      </div>
                    )
                  })}
                </div>

                {/* Sessions for selected date */}
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Sessions on {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                  </h4>
                  {sessions.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">
                      No sessions scheduled for this date
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {sessions.map((session) => (
                        <button
                          key={session.id}
                          onClick={() => handleSessionClick(session)}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                            selectedSession?.id === session.id
                              ? 'border-blue-500 bg-blue-50'
                              : `border-transparent ${getColorClasses(session.color)}`
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold">{session.courseCode}</span>
                                {getStatusBadge(session.status)}
                              </div>
                              <p className="text-sm font-semibold mb-1">{session.courseName}</p>
                              <p className="text-xs text-gray-600 mb-1">👨‍🏫 {session.instructor}</p>
                              <p className="text-xs text-gray-600">
                                🕐 {session.startTime} - {session.endTime} • 📍 {session.room}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageSchedule
