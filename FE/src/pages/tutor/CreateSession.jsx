import { useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { mockRooms, mockSessionTypes, mockStudentAvailability, checkRoomAvailability, validateSessionData } from '../../data/mockRooms'

function CreateSession() {
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 4, 16)) // May 16, 2024
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 4, 1))
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [formData, setFormData] = useState({
    date: '2024-05-20',
    timeStart: '16:30',
    timeEnd: '18:30',
    room: '',
    topic: '',
    type: 'meetings'
  })
  const [errors, setErrors] = useState({})
  const [roomError, setRoomError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

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
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleRoomSelect = (room) => {
    setSelectedRoom(room)
    setRoomError('')
    
    // Check room availability
    const availabilityCheck = checkRoomAvailability(
      room.id,
      formData.date,
      formData.timeStart,
      formData.timeEnd
    )
    
    if (!availabilityCheck.available) {
      setRoomError(availabilityCheck.error)
      return
    }
    
    setFormData(prev => ({
      ...prev,
      room: room.name
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSuccessMessage('')
    
    const validation = validateSessionData(formData)
    
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }
    
    if (roomError) {
      return
    }
    
    // Simulate successful session creation
    console.log('Creating session:', formData)
    setSuccessMessage('Session created successfully! Students have been notified.')
    
    // Reset form after delay
    setTimeout(() => {
      setSuccessMessage('')
      setFormData({
        date: '',
        timeStart: '',
        timeEnd: '',
        room: '',
        topic: '',
        type: 'meetings'
      })
      setSelectedRoom(null)
    }, 3000)
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

  const getColorClasses = (color) => {
    const colors = {
      purple: 'bg-purple-100',
      blue: 'bg-blue-100',
      green: 'bg-green-100'
    }
    return colors[color] || 'bg-gray-100'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Create Session</h1>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - Available Time Slots and Rooms */}
          <div className="lg:col-span-1 space-y-6">
            {/* Week View */}
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Your available time</h3>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {weekDates.slice(0, 5).map((date, index) => {
                  const isSelected = isSameDay(date, selectedDate)
                  const dayName = ['Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleDateClick(date)}
                      className={`text-center p-2 rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-blue-900 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <div className="text-lg font-bold mb-1">{date.getDate()}</div>
                      <div className="text-xs">{dayName}</div>
                    </button>
                  )
                })}
              </div>

              {/* Available Time Slots */}
              <div className="space-y-2">
                <div className="p-3 bg-purple-100 rounded-lg text-center">
                  <div className="text-sm font-medium text-gray-900">10:00 AM - 01:00PM</div>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg text-center">
                  <div className="text-sm font-medium text-gray-900">02:30 PM - 03:30 PM</div>
                </div>
                <div className="p-3 bg-green-100 rounded-lg text-center">
                  <div className="text-sm font-medium text-gray-900">04:00 PM - 06:00 PM</div>
                </div>
              </div>
            </Card>

            {/* Available Rooms */}
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
              {roomError && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
                  {roomError}
                </div>
              )}
            </Card>
          </div>

          {/* Middle - Calendar and Form */}
          <div className="lg:col-span-1">
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

              {/* Create Session Form */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Set schedule</h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    {errors.date && (
                      <p className="mt-1 text-xs text-red-600">{errors.date}</p>
                    )}
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
                      name="room"
                      value={formData.room}
                      onChange={handleInputChange}
                      placeholder="SF 13"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.room && (
                      <p className="mt-1 text-xs text-red-600">{errors.room}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Topic
                    </label>
                    <input
                      type="text"
                      name="topic"
                      value={formData.topic}
                      onChange={handleInputChange}
                      placeholder="How to RCE?"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.topic && (
                      <p className="mt-1 text-xs text-red-600">{errors.topic}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {mockSessionTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                    {errors.type && (
                      <p className="mt-1 text-xs text-red-600">{errors.type}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                  >
                    Create Session
                  </Button>
                </form>
              </div>
            </Card>
          </div>

          {/* Right - Student Availability */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              {/* Week View */}
              <div className="grid grid-cols-5 gap-2 mb-6">
                {weekDates.slice(0, 5).map((date, index) => {
                  const isSelected = isSameDay(date, selectedDate)
                  const dayName = ['Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleDateClick(date)}
                      className={`text-center p-2 rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-blue-900 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <div className="text-lg font-bold mb-1">{date.getDate()}</div>
                      <div className="text-xs">{dayName}</div>
                    </button>
                  )
                })}
              </div>

              <h3 className="text-sm font-semibold text-gray-900 mb-3">Student's availability</h3>
              <div className="space-y-2">
                {mockStudentAvailability.map((slot) => (
                  <div
                    key={slot.id}
                    className={`p-3 ${getColorClasses(slot.color)} rounded-lg text-center`}
                  >
                    <div className="text-sm font-medium text-gray-900">{slot.display}</div>
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

export default CreateSession
