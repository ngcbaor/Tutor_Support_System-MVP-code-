// Mock data for rooms
export const mockRooms = [
  { id: 'sf13', name: 'SF 13', available: true },
  { id: 'sf25', name: 'SF 25', available: true },
  { id: 'b9-304', name: 'B9-304', available: true },
  { id: 'b4-309', name: 'B4-309', available: true },
  { id: 'b6-303', name: 'B6-303', available: true },
  { id: 'b9-305', name: 'B9-305', available: false }
]

// Mock session types
export const mockSessionTypes = [
  { id: 'meetings', name: 'Meetings' },
  { id: 'organizing', name: 'Organizing Advise Sessions' },
  { id: 'meetup', name: 'Meetup Sessions' }
]

// Mock student availability for a specific date
export const mockStudentAvailability = [
  {
    id: 'slot-1',
    startTime: '10:00',
    endTime: '13:00',
    display: '10:00 AM - 01:00PM',
    color: 'purple'
  },
  {
    id: 'slot-2',
    startTime: '14:30',
    endTime: '15:30',
    display: '02:30 PM - 03:30 PM',
    color: 'blue'
  },
  {
    id: 'slot-3',
    startTime: '16:00',
    endTime: '18:00',
    display: '04:00 PM - 06:00 PM',
    color: 'green'
  }
]

// Helper function to check room availability for a time slot
export const checkRoomAvailability = (roomId, date, startTime, endTime) => {
  // Mock logic - in real app would check against database
  const room = mockRooms.find(r => r.id === roomId)
  if (!room) return { available: false, error: 'Room not found' }
  if (!room.available) return { available: false, error: 'Room unavailable' }
  
  // Additional time-based checks could go here
  return { available: true }
}

// Validate session creation data
export const validateSessionData = (data) => {
  const errors = {}
  
  if (!data.date) {
    errors.date = 'Date is required'
  }
  
  if (!data.timeStart || !data.timeEnd) {
    errors.time = 'Time period is required'
  }
  
  if (data.timeStart && data.timeEnd && data.timeStart >= data.timeEnd) {
    errors.time = 'End time must be after start time'
  }
  
  if (!data.room) {
    errors.room = 'Room is required'
  }
  
  if (!data.topic) {
    errors.topic = 'Topic is required'
  }
  
  if (!data.type) {
    errors.type = 'Session type is required'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
