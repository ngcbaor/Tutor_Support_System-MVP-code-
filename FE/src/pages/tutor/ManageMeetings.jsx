import { useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { mockMeetings, validateMeetingRecord } from '../../data/mockMeetings'

function ManageMeetings() {
  const [selectedMeeting, setSelectedMeeting] = useState(null)
  const [showRecordModal, setShowRecordModal] = useState(false)
  const [recordData, setRecordData] = useState({
    summary: '',
    topicsCovered: '',
    studentProgress: '',
    nextSteps: '',
    attendance: ''
  })
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')

  const handleMeetingClick = (meeting) => {
    setSelectedMeeting(meeting)
    if (meeting.record) {
      setRecordData({
        summary: meeting.record.summary,
        topicsCovered: meeting.record.topicsCovered.join(', '),
        studentProgress: meeting.record.studentProgress,
        nextSteps: meeting.record.nextSteps || '',
        attendance: meeting.record.attendance
      })
    } else {
      const attendedCount = meeting.students.filter(s => s.attended).length
      setRecordData({
        summary: '',
        topicsCovered: '',
        studentProgress: '',
        nextSteps: '',
        attendance: `${attendedCount}/${meeting.students.length} students attended`
      })
    }
  }

  const handleWriteRecord = () => {
    setShowRecordModal(true)
    setErrors({})
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setRecordData(prev => ({
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

  const handleSaveRecord = () => {
    const topicsArray = recordData.topicsCovered
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)

    const validation = validateMeetingRecord({
      ...recordData,
      topicsCovered: topicsArray
    })

    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    // Update the meeting record
    const meetingIndex = mockMeetings.findIndex(m => m.id === selectedMeeting.id)
    if (meetingIndex !== -1) {
      mockMeetings[meetingIndex].hasRecord = true
      mockMeetings[meetingIndex].record = {
        summary: recordData.summary,
        topicsCovered: topicsArray,
        studentProgress: recordData.studentProgress,
        nextSteps: recordData.nextSteps,
        attendance: recordData.attendance,
        lastUpdated: new Date().toISOString()
      }
    }

    setSuccessMessage('Meeting record saved successfully!')
    setShowRecordModal(false)
    
    // Update selected meeting
    setSelectedMeeting(mockMeetings[meetingIndex])

    setTimeout(() => {
      setSuccessMessage('')
    }, 3000)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getColorClasses = (hasRecord) => {
    return hasRecord
      ? 'bg-green-50 border-green-200'
      : 'bg-blue-50 border-blue-200'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Meetings</h1>
          <p className="text-gray-600">Review and write records for your tutoring sessions</p>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left - Meeting List */}
          <div>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sessions</h3>
              <div className="space-y-3">
                {mockMeetings.map((meeting) => (
                  <button
                    key={meeting.id}
                    onClick={() => handleMeetingClick(meeting)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      getColorClasses(meeting.hasRecord)
                    } ${
                      selectedMeeting?.id === meeting.id
                        ? 'ring-2 ring-blue-500 ring-offset-2'
                        : 'hover:shadow-md'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="text-xs font-medium text-gray-600 mb-1">
                          {meeting.courseCode}
                        </div>
                        <div className="font-semibold text-gray-900 mb-1">
                          {meeting.courseName}
                        </div>
                        <div className="text-sm text-gray-700">{meeting.topic}</div>
                      </div>
                      <div className="text-right">
                        {meeting.hasRecord ? (
                          <Badge variant="success" className="text-xs">
                            Recorded
                          </Badge>
                        ) : (
                          <Badge variant="warning" className="text-xs">
                            No Record
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-600 mt-2">
                      <span>📅 {formatDate(meeting.date)}</span>
                      <span>🕐 {meeting.startTime} - {meeting.endTime}</span>
                      <span>📍 {meeting.room}</span>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Right - Meeting Details */}
          <div>
            {selectedMeeting ? (
              <Card className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {selectedMeeting.courseName}
                    </h3>
                    <div className="text-sm text-gray-600">
                      {selectedMeeting.courseCode} • {selectedMeeting.chapter}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Date</div>
                        <div className="font-medium text-gray-900">
                          {formatDate(selectedMeeting.date)}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Time</div>
                        <div className="font-medium text-gray-900">
                          {selectedMeeting.startTime} - {selectedMeeting.endTime}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Room</div>
                        <div className="font-medium text-gray-900">{selectedMeeting.room}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Topic</div>
                        <div className="font-medium text-gray-900">{selectedMeeting.topic}</div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Students</div>
                    <div className="space-y-2">
                      {selectedMeeting.students.map((student) => (
                        <div
                          key={student.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <span className="text-sm text-gray-900">{student.name}</span>
                          <Badge variant={student.attended ? 'success' : 'default'} className="text-xs">
                            {student.attended ? 'Attended' : 'Absent'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedMeeting.record && (
                    <div className="border-t pt-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">Meeting Record</div>
                      <div className="space-y-3 text-sm">
                        <div>
                          <div className="text-xs text-gray-600 mb-1">Summary</div>
                          <div className="text-gray-900">{selectedMeeting.record.summary}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 mb-1">Topics Covered</div>
                          <div className="flex flex-wrap gap-2">
                            {selectedMeeting.record.topicsCovered.map((topic, index) => (
                              <Badge key={index} variant="info" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 mb-1">Student Progress</div>
                          <div className="text-gray-900">{selectedMeeting.record.studentProgress}</div>
                        </div>
                        {selectedMeeting.record.nextSteps && (
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Next Steps</div>
                            <div className="text-gray-900">{selectedMeeting.record.nextSteps}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <Button
                      variant="primary"
                      className="w-full"
                      onClick={handleWriteRecord}
                    >
                      {selectedMeeting.hasRecord ? 'Edit Meeting Record' : 'Write Meeting Record'}
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-6">
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Select a meeting to view details</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Write/Edit Meeting Record Modal */}
        {showRecordModal && selectedMeeting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedMeeting.hasRecord ? 'Edit' : 'Write'} Meeting Record
                  </h3>
                  <button
                    onClick={() => setShowRecordModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {selectedMeeting.courseName} - {selectedMeeting.topic}
                  </div>
                  <div className="text-xs text-gray-600">
                    {formatDate(selectedMeeting.date)} • {selectedMeeting.startTime} - {selectedMeeting.endTime}
                  </div>
                </div>

                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Session Summary *
                    </label>
                    <textarea
                      name="summary"
                      value={recordData.summary}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Brief overview of what was covered in this session..."
                    />
                    {errors.summary && (
                      <p className="mt-1 text-xs text-red-600">{errors.summary}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Topics Covered * (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="topicsCovered"
                      value={recordData.topicsCovered}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Prototype chain basics, Pollution techniques, Real-world examples"
                    />
                    {errors.topicsCovered && (
                      <p className="mt-1 text-xs text-red-600">{errors.topicsCovered}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Student Progress *
                    </label>
                    <textarea
                      name="studentProgress"
                      value={recordData.studentProgress}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="How did students perform? Any challenges they faced?"
                    />
                    {errors.studentProgress && (
                      <p className="mt-1 text-xs text-red-600">{errors.studentProgress}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Next Steps (optional)
                    </label>
                    <textarea
                      name="nextSteps"
                      value={recordData.nextSteps}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="What should students do next? Any assignments or follow-up?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Attendance
                    </label>
                    <input
                      type="text"
                      name="attendance"
                      value={recordData.attendance}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      readOnly
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      className="flex-1"
                      onClick={() => setShowRecordModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      className="flex-1"
                      onClick={handleSaveRecord}
                    >
                      Save Record
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageMeetings
