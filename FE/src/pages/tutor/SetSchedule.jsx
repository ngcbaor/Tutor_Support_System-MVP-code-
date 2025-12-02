import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { mockRooms, mockSessionTypes } from '../../data/mockRooms'

// Mock courses for the tutor
const mockAssignedCourses = [
  { id: 'cs1r2', code: 'CS 1R2', name: 'Web Exploitation' },
  { id: 'cs1r2-re', code: 'CS 1R2', name: 'Reverse Engineering' },
  { id: 'cs1b9', code: 'CS 1B9', name: 'Binary Exploitation' },
  { id: 'cs1', code: 'CS 1', name: 'Cryptography' }
]

// Mock modes
const mockModes = [
  { id: 'online', name: 'Online' },
  { id: 'in-person', name: 'In-person' },
  { id: 'hybrid', name: 'Hybrid' }
]

function SetSchedule() {
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 4, 20)) // May 20, 2024
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 4, 1))
  const [schedules, setSchedules] = useState([])
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [roomError, setRoomError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  
  const [formData, setFormData] = useState({
    course: '',
    blocks: '1',
    mode: 'in-person',
    classroom: '',
    date: '2024-05-20',
    timeStart: '16:30',
    timeEnd: '18:30'
  })
  const [errors, setErrors] = useState({})

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
    setFormData(prev => ({
      ...prev,
      date: date.toISOString().split('T')[0]
    }))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleRoomSelect = (room) => {
    if (!room.available) {
      setRoomError('Room unavailable')
      return
    }
    
    setSelectedRoom(room)
    setRoomError('')
    setFormData(prev => ({
      ...prev,
      classroom: room.name
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.course) {
      newErrors.course = 'Please select a course'
    }
    
    if (!formData.classroom) {
      newErrors.classroom = 'Please select a classroom'
    }
    
    if (!formData.timeStart || !formData.timeEnd) {
      newErrors.time = 'Time period is required'
    }
    
    if (formData.timeStart >= formData.timeEnd) {
      newErrors.time = 'End time must be after start time'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleConfirmSchedule = () => {
    setSuccessMessage('')
    setRoomError('')
    
    if (!validateForm()) {
      return
    }
    
    // Check room availability one more time before confirming
    if (!selectedRoom || !selectedRoom.available) {
      setRoomError('Room unavailable. Please select another classroom.')
      return
    }
    
    // Add schedule to list
    const newSchedule = {
      id: `schedule-${Date.now()}`,
      ...formData,
      courseName: mockAssignedCourses.find(c => c.id === formData.course)?.name || '',
      courseCode: mockAssignedCourses.find(c => c.id === formData.course)?.code || '',
      createdAt: new Date().toISOString()
    }
    
    setSchedules(prev => [...prev, newSchedule])
    setSuccessMessage('Schedule published successfully! Students have been notified.')
    
    // Reset form after delay
    setTimeout(() => {
      setSuccessMessage('')
      setFormData({
        course: '',
        blocks: '1',
        mode: 'in-person',
        classroom: '',
        date: formData.date,
        timeStart: '',
        timeEnd: ''
      })
      setSelectedRoom(null)
    }, 3000)
  }

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const calendarDays = getDaysInMonth(currentMonth)

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

  const weekDates = getWeekDates()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Set Schedule</h1>
          <p className="text-gray-600">Set and publish course schedules with classroom assignments</p>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}

        {roomError && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {roomError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - Available Rooms */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Available rooms</h3>
              <div className="space-y-2">
                {mockRooms.map((room) => (
                  <div
                    key={room.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      selectedRoom?.id === room.id
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : room.available
                        ? 'bg-blue-900 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    <span className="font-medium">{room.name}</span>
                    {room.available ? (
                      <button
                        onClick={() => handleRoomSelect(room)}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                      >
                        Select
                      </button>
                    ) : (
                      <span className="text-xs">Unavailable</span>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Existing Schedules */}
            {schedules.length > 0 && (
              <Card className="p-4 mt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Published Schedules</h3>
                <div className="space-y-2">
                  {schedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="p-3 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <div className="text-xs font-medium text-green-700 mb-1">
                        {schedule.courseCode}
                      </div>
                      <div className="text-sm font-semibold text-gray-900 mb-1">
                        {schedule.courseName}
                      </div>
                      <div className="text-xs text-gray-600">
                        {new Date(schedule.date).toLocaleDateString()} • {schedule.timeStart} - {schedule.timeEnd}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        📍 {schedule.classroom} • {schedule.mode}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Middle - Calendar and Form */}
          <div className="lg:col-span-2">
            <Card className="p-6">
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

                    return (
                      <button
                        key={index}
                        onClick={() => handleDateClick(date)}
                        className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-colors ${
                          isSelected
                            ? 'bg-blue-900 text-white font-semibold ring-2 ring-blue-500'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {date.getDate()}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Set Schedule Form */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Set schedule</h3>
                
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time period
                    </label>
                    <input
                      type="text"
                      value={formData.timeStart && formData.timeEnd ? `${formData.timeStart} - ${formData.timeEnd}` : ''}
                      readOnly
                      placeholder="16:30 - 18:30"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 mb-2"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="time"
                        name="timeStart"
                        value={formData.timeStart}
                        onChange={handleInputChange}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="time"
                        name="timeEnd"
                        value={formData.timeEnd}
                        onChange={handleInputChange}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {errors.time && (
                      <p className="mt-1 text-xs text-red-600">{errors.time}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Room
                    </label>
                    <input
                      type="text"
                      name="classroom"
                      value={formData.classroom}
                      readOnly
                      placeholder="SF 13"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                    <p className="mt-1 text-xs text-gray-500">Select a room from the list on the left</p>
                    {errors.classroom && (
                      <p className="mt-1 text-xs text-red-600">{errors.classroom}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course
                    </label>
                    <select
                      name="course"
                      value={formData.course}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a course</option>
                      {mockAssignedCourses.map(course => (
                        <option key={course.id} value={course.id}>
                          {course.code} - {course.name}
                        </option>
                      ))}
                    </select>
                    {errors.course && (
                      <p className="mt-1 text-xs text-red-600">{errors.course}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Blocks
                    </label>
                    <select
                      name="blocks"
                      value={formData.blocks}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="1">1 Block (2 hours)</option>
                      <option value="2">2 Blocks (4 hours)</option>
                      <option value="3">3 Blocks (6 hours)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mode
                    </label>
                    <select
                      name="mode"
                      value={formData.mode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {mockModes.map(mode => (
                        <option key={mode.id} value={mode.id}>
                          {mode.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button
                    type="button"
                    variant="primary"
                    className="w-full"
                    onClick={handleConfirmSchedule}
                  >
                    Confirm Schedule
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SetSchedule
