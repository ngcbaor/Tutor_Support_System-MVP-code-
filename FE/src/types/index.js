// User roles
export const ROLES = {
  STUDENT: 'student',
  TUTOR: 'tutor',
  COORDINATOR: 'coordinator',
  ACADEMIC: 'academic',
  PROGRAM_ADMIN: 'program_admin'
}

// Session status
export const SESSION_STATUS = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  MAKEUP: 'makeup'
}

// Sync states
export const SYNC_STATES = {
  SYNCED: 'synced',
  QUEUED: 'queued',
  FAILED: 'failed'
}

// Registration status
export const REGISTRATION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  REJECTED: 'rejected'
}

export default {
  ROLES,
  SESSION_STATUS,
  SYNC_STATES,
  REGISTRATION_STATUS
}
