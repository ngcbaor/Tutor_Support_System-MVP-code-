// Mock data for tutor availability
export const mockAvailability = [
  {
    id: 'avail-1',
    date: '2024-05-20',
    startTime: '16:30',
    endTime: '18:30',
    course: 'CS 1R2 - Web Exploitation',
    mode: 'online',
    status: 'available'
  },
  {
    id: 'avail-2',
    date: '2024-05-21',
    startTime: '14:00',
    endTime: '16:00',
    course: 'CS 1R2 - Reverse Engineering',
    mode: 'in-person',
    status: 'available'
  },
  {
    id: 'avail-3',
    date: '2024-05-22',
    startTime: '10:00',
    endTime: '12:00',
    course: 'CS 1B9 - Binary Exploitation',
    mode: 'online',
    status: 'available'
  }
]

// Mock courses for the tutor
export const mockTutorCourses = [
  { id: 'cs1r2-web', name: 'CS 1R2 - Web Exploitation' },
  { id: 'cs1r2-reverse', name: 'CS 1R2 - Reverse Engineering' },
  { id: 'cs1b9', name: 'CS 1B9 - Binary Exploitation' },
  { id: 'cs1', name: 'CS 1 - Cryptography' }
]

// Helper function to get availability by date range
export const getAvailabilityByDateRange = (startDate, endDate) => {
  return mockAvailability.filter(avail => {
    const availDate = new Date(avail.date)
    return availDate >= new Date(startDate) && availDate <= new Date(endDate)
  })
}

// Helper function to check if time slot overlaps with existing availability
export const checkTimeOverlap = (date, startTime, endTime, excludeId = null) => {
  const dayAvailability = mockAvailability.filter(
    avail => avail.date === date && avail.id !== excludeId
  )
  
  for (const avail of dayAvailability) {
    if (
      (startTime >= avail.startTime && startTime < avail.endTime) ||
      (endTime > avail.startTime && endTime <= avail.endTime) ||
      (startTime <= avail.startTime && endTime >= avail.endTime)
    ) {
      return true // Overlap detected
    }
  }
  return false
}

// Helper function to validate time slot (e.g., must be during working hours 8:00-22:00)
export const validateTimeSlot = (startTime, endTime) => {
  const [startHour] = startTime.split(':').map(Number)
  const [endHour] = endTime.split(':').map(Number)
  
  if (startHour < 8 || endHour > 22) {
    return { valid: false, error: 'Time must be between 08:00 and 22:00' }
  }
  
  if (startTime >= endTime) {
    return { valid: false, error: 'End time must be after start time' }
  }
  
  const duration = (endHour * 60 + parseInt(endTime.split(':')[1])) - 
                   (startHour * 60 + parseInt(startTime.split(':')[1]))
  
  if (duration < 30) {
    return { valid: false, error: 'Minimum session duration is 30 minutes' }
  }
  
  if (duration > 240) {
    return { valid: false, error: 'Maximum session duration is 4 hours' }
  }
  
  return { valid: true }
}
