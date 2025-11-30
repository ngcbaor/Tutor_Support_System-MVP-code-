import { useState, useEffect } from 'react'
import { mockSessions, mockUpcomingEvents, getSessionsByDate } from '../../data/mockSessions'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

function Timetable() {
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 4, 16)) // May 16, 2025
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 4, 1)) // May 2025
  const [selectedSession, setSelectedSession] = useState(null)
  const [sessions, setSessions] = useState([])

  useEffect(() => {
    // Load sessions for the selected date
    const dateString = selectedDate.toISOString().split('T')[0]
    const daySessions = getSessionsByDate(dateString)
    setSessions(daySessions)
    
    // Auto-select first session if available
    if (daySessions.length > 0 && !selectedSession) {
      setSelectedSession(daySessions[0])
    }
  }, [selectedDate])

  const getColorClasses = (color, status) => {
    const baseColors = {
      purple: 'bg-purple-100 border-purple-200',
      blue: 'bg-blue-100 border-blue-200',
      green: 'bg-green-100 border-green-200',
      yellow: 'bg-yellow-100 border-yellow-200'
    }
    return baseColors[color] || 'bg-gray-100 border-gray-200'
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
    
    // Add empty slots for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const isToday = (date) => {
    if (!date) return false
    const today = new Date()
    return date.toDateString() === today.toDateString()
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
    setSelectedSession(null)
  }

  const handleSessionClick = (session) => {
    setSelectedSession(session)
  }

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const calendarDays = getDaysInMonth(currentMonth)

  // Get week view dates (7 days starting from Monday)
  const getWeekDates = () => {
    const dates = []
    const startDate = new Date(selectedDate)
    // Find the Monday of the current week
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

  const weekDates = getWeekDates()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Timetable</h1>
          {/* Note: Set Availability button removed for students */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left side - Session details (only shown when session selected) */}
          {selectedSession && (
            <div className="lg:col-span-1 order-2 lg:order-1">
              <Card className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">{selectedSession.courseCode}</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {selectedSession.courseName}
                    </h3>
                    <div className="text-sm text-gray-600">
                      {selectedSession.startTime} - {selectedSession.endTime}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase mb-1">
                          Lecturer
                        </div>
                        <div className="text-sm text-gray-900">{selectedSession.instructor}</div>
                      </div>

                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase mb-1">
                          Chapter
                        </div>
                        <div className="text-sm text-gray-900">{selectedSession.chapter}</div>
                      </div>

                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase mb-1">
                          Topic
                        </div>
                        <div className="text-sm text-gray-900">{selectedSession.topic}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Middle - Timetable and Classes */}
          <div className={`${selectedSession ? 'lg:col-span-1' : 'lg:col-span-2'} order-1 lg:order-2`}>
            <Card className="p-6">
              {/* Week view header */}
              <div className="mb-6">
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {weekDates.map((date, index) => {
                    const isSelected = isSameDay(date, selectedDate)
                    const dayName = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]
                    
                    return (
                      <button
                        key={index}
                        onClick={() => handleDateClick(date)}
                        className={`text-center p-3 rounded-lg transition-colors ${
                          isSelected
                            ? 'bg-blue-900 text-white'
                            : 'bg-white border border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="text-xs font-medium mb-1">{date.getDate()}</div>
                        <div className="text-xs">{dayName}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Classes for selected day */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Classes</h3>
                <div className="space-y-3">
                  {sessions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No classes scheduled for this day
                    </div>
                  ) : (
                    sessions.map((session) => (
                      <button
                        key={session.id}
                        onClick={() => handleSessionClick(session)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          getColorClasses(session.color, session.status)
                        } ${
                          selectedSession?.id === session.id
                            ? 'ring-2 ring-blue-500 ring-offset-2'
                            : 'hover:shadow-md'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="text-xs font-medium text-gray-600 mb-1">
                              {session.courseCode}
                            </div>
                            <div className="font-semibold text-gray-900 mb-1">
                              {session.courseName}
                            </div>
                            <div className="text-sm text-gray-700">{session.room}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">
                              {session.timeDisplay}
                            </div>
                            {session.status === 'postponed' && (
                              <Badge variant="warning" className="mt-1 text-xs">
                                Postponed
                              </Badge>
                            )}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Right side - Calendar and Events */}
          <div className="lg:col-span-1 order-3 space-y-6">
            {/* Calendar */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={handlePreviousMonth}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h3 className="text-lg font-semibold text-gray-900">
                  {formatDateForDisplay(currentMonth)}
                </h3>
                <button
                  onClick={handleNextMonth}
                  className="p-1 hover:bg-gray-100 rounded"
                >
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
                      index >= 5 ? 'text-red-500' : 'text-gray-900'
                    }`}
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
                  const isCurrentDay = isToday(date)

                  return (
                    <button
                      key={index}
                      onClick={() => handleDateClick(date)}
                      className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-blue-900 text-white font-semibold'
                          : isCurrentDay
                          ? 'bg-blue-100 text-blue-900 font-semibold'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  )
                })}
              </div>
            </Card>

            {/* Upcoming Events */}
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Upcoming Events</h3>
              <div className="space-y-3">
                {mockUpcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">{event.title}</div>
                      <div className="text-xs text-gray-600 mt-0.5">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        {' @ '}
                        {event.time || `${event.startTime} to ${event.endTime}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Timetable
