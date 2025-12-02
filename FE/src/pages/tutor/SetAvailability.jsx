import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { mockAvailability, mockTutorCourses, checkTimeOverlap, validateTimeSlot } from '../../data/mockAvailability'

function SetAvailability() {
  const [selectedDate, setSelectedDate] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 4, 1)) // May 2024
  const [availabilitySlots, setAvailabilitySlots] = useState(mockAvailability)
  const [showForm, setShowForm] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  
  // Form state
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    course: '',
    mode: 'online'
  })
  const [formErrors, setFormErrors] = useState({})

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
    setFormData({
      ...formData,
      date: date.toISOString().split('T')[0]
    })
    setShowForm(true)
    setFormErrors({})
    setErrorMessage('')
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.date) {
      errors.date = 'Please select a date'
    }
    
    if (!formData.startTime) {
      errors.startTime = 'Start time is required'
    }
    
    if (!formData.endTime) {
      errors.endTime = 'End time is required'
    }
    
    if (!formData.course) {
      errors.course = 'Please select a course'
    }
    
    if (formData.startTime && formData.endTime) {
      const timeValidation = validateTimeSlot(formData.startTime, formData.endTime)
      if (!timeValidation.valid) {
        errors.time = timeValidation.error
        setErrorMessage(timeValidation.error)
      }
      
      if (checkTimeOverlap(formData.date, formData.startTime, formData.endTime)) {
        errors.time = 'This time slot overlaps with existing availability'
        setErrorMessage('Error: Overlapping times. Please choose another time slot.')
      }
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSuccessMessage('')
    setErrorMessage('')
    
    if (validateForm()) {
      // Add new availability slot
      const newSlot = {
        id: `avail-${Date.now()}`,
        ...formData,
        status: 'available'
      }
      
      setAvailabilitySlots(prev => [...prev, newSlot])
      setSuccessMessage('Time set successfully!')
      
      // Reset form after short delay
      setTimeout(() => {
        setShowForm(false)
        setFormData({
          date: '',
          startTime: '',
          endTime: '',
          course: '',
          mode: 'online'
        })
        setSuccessMessage('')
      }, 2000)
    }
  }

  const handleDeleteSlot = (slotId) => {
    setAvailabilitySlots(prev => prev.filter(slot => slot.id !== slotId))
    setSuccessMessage('Availability slot deleted successfully')
    setTimeout(() => setSuccessMessage(''), 2000)
  }

  const getAvailabilityForDate = (date) => {
    if (!date) return []
    const dateStr = date.toISOString().split('T')[0]
    return availabilitySlots.filter(slot => slot.date === dateStr)
  }

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const calendarDays = getDaysInMonth(currentMonth)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Set Availability</h1>
          <p className="text-gray-600">Manage your available time slots for tutoring sessions</p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - Classes List */}
          <div className="lg:col-span-1 order-1">
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Your Classes</h3>
              <div className="space-y-2">
                {availabilitySlots.slice(0, 5).map((slot) => {
                  const slotDate = new Date(slot.date)
                  return (
                    <div
                      key={slot.id}
                      className="p-3 bg-purple-50 border border-purple-200 rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="text-xs font-medium text-purple-600 mb-1">
                            {slot.course.split(' - ')[0]}
                          </div>
                          <div className="text-sm font-semibold text-gray-900">
                            {slot.course.split(' - ')[1] || slot.course}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteSlot(slot.id)}
                          className="text-red-500 hover:text-red-700 ml-2"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="text-xs text-gray-700">
                        {slotDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {slot.startTime} - {slot.endTime}
                      </div>
                      <Badge variant="info" className="mt-2 text-xs">
                        {slot.mode === 'online' ? 'Online' : 'In-person'}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>

          {/* Middle - Calendar and Form */}
          <div className="lg:col-span-1 order-2">
            <Card className="p-6">
              {/* Calendar */}
              <div className="mb-6">
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
                    const hasAvailability = getAvailabilityForDate(date).length > 0

                    return (
                      <button
                        key={index}
                        onClick={() => handleDateClick(date)}
                        className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-colors relative ${
                          isSelected
                            ? 'bg-blue-900 text-white font-semibold ring-2 ring-blue-500'
                            : hasAvailability
                            ? 'bg-blue-100 text-blue-900 hover:bg-blue-200'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {date.getDate()}
                        {hasAvailability && !isSelected && (
                          <span className="absolute bottom-1 w-1 h-1 bg-blue-600 rounded-full"></span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Set Availability Form */}
              {showForm && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Set availability</h3>
                  
                  {errorMessage && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
                      {errorMessage}
                    </div>
                  )}

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
                      {formErrors.date && (
                        <p className="mt-1 text-xs text-red-600">{formErrors.date}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Time period
                      </label>
                      <input
                        type="text"
                        name="timeDisplay"
                        value={formData.startTime && formData.endTime ? `${formData.startTime} - ${formData.endTime}` : ''}
                        placeholder="16:30 - 18:30"
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <input
                          type="time"
                          name="startTime"
                          value={formData.startTime}
                          onChange={handleInputChange}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Start"
                        />
                        <input
                          type="time"
                          name="endTime"
                          value={formData.endTime}
                          onChange={handleInputChange}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="End"
                        />
                      </div>
                      {formErrors.time && (
                        <p className="mt-1 text-xs text-red-600">{formErrors.time}</p>
                      )}
                      {!formErrors.time && formData.startTime && formData.endTime && (
                        <p className="mt-1 text-xs text-green-600">Available time</p>
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
                        {mockTutorCourses.map(course => (
                          <option key={course.id} value={course.name}>
                            {course.name}
                          </option>
                        ))}
                      </select>
                      {formErrors.course && (
                        <p className="mt-1 text-xs text-red-600">{formErrors.course}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mode
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="mode"
                            value="online"
                            checked={formData.mode === 'online'}
                            onChange={handleInputChange}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">Online</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="mode"
                            value="in-person"
                            checked={formData.mode === 'in-person'}
                            onChange={handleInputChange}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">In-person</span>
                        </label>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full"
                      disabled={Object.keys(formErrors).length > 0 && errorMessage}
                    >
                      Confirm Availability
                    </Button>
                  </form>
                </div>
              )}
            </Card>
          </div>

          {/* Right - Upcoming Events (reuse from student view) */}
          <div className="lg:col-span-1 order-3">
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Upcoming Events</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">Level-Up Seminar</div>
                    <div className="text-xs text-gray-600 mt-0.5">May 31 @ 10:00 AM</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">Innovation Fair</div>
                    <div className="text-xs text-gray-600 mt-0.5">June 13 @ 9:00 AM</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">College Elections</div>
                    <div className="text-xs text-gray-600 mt-0.5">June 19 from 8:00 AM to 5:00 PM</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SetAvailability
