import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { getStudentById, getProgressNotesByStudentId, calculateAverageRubrics } from '../../data/mockClasses'
import RecordProgressModal from '../../components/tutor/RecordProgressModal'
import CreateReportModal from '../../components/tutor/CreateReportModal'

function StudentProfile() {
  const { classId, studentId } = useParams()
  const student = getStudentById(studentId)
  const initialProgressNotes = getProgressNotesByStudentId(studentId)
  
  const [progressNotes, setProgressNotes] = useState(initialProgressNotes)
  const averageRubrics = calculateAverageRubrics(progressNotes)
  
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)

  const handleProgressSaved = (newProgressNote) => {
    setProgressNotes(prev => [newProgressNote, ...prev])
  }

  if (!student) {
    return <div className="text-center py-12">Student not found</div>
  }

  // Calculate overall average
  const overallAverage = averageRubrics 
    ? ((parseFloat(averageRubrics.topicMastery) + 
        parseFloat(averageRubrics.problemSolving) + 
        parseFloat(averageRubrics.participation) + 
        parseFloat(averageRubrics.studySkills) + 
        parseFloat(averageRubrics.homework)) / 5).toFixed(1)
    : 'N/A'

  // Find top skill and needs focus
  const getTopAndWeakSkills = () => {
    if (!averageRubrics) return { top: 'N/A', weak: 'N/A' }
    
    const skills = {
      'Topic Mastery': parseFloat(averageRubrics.topicMastery),
      'Problem Solving': parseFloat(averageRubrics.problemSolving),
      'Participation': parseFloat(averageRubrics.participation),
      'Study Skills': parseFloat(averageRubrics.studySkills),
      'Homework': parseFloat(averageRubrics.homework)
    }
    
    const sorted = Object.entries(skills).sort((a, b) => b[1] - a[1])
    return { top: sorted[0][0], weak: sorted[sorted.length - 1][0] }
  }

  const { top, weak } = getTopAndWeakSkills()

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  const getRubricColor = (score) => {
    if (score >= 4) return 'bg-green-600'
    if (score >= 3) return 'bg-blue-600'
    return 'bg-yellow-600'
  }

  const getRubricLabel = (key) => {
    const labels = {
      topicMastery: 'Topic Mastery',
      problemSolving: 'Problem Solving',
      participation: 'Participation',
      studySkills: 'Study Skills',
      homework: 'Homework'
    }
    return labels[key] || key
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        <Link to="/tutor/class" className="text-blue-600 hover:text-blue-700 font-medium">
          My Classes
        </Link>
        <span className="mx-2">/</span>
        <Link to={`/tutor/class/${classId}`} className="text-blue-600 hover:text-blue-700 font-medium">
          Advanced Web...
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{student.name}</span>
      </div>

      {/* Student Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className={`
              w-16 h-16 rounded-full text-white font-semibold text-2xl
              flex items-center justify-center ${student.avatarColor}
            `}>
              {student.avatar}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
              <p className="text-gray-600">ID: {student.id} - Class: IT4409</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsReportModalOpen(true)}
              className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Create Report
            </button>
            <button 
              onClick={() => setIsProgressModalOpen(true)}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Record Progress
            </button>
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Overall Average</div>
          <div className={`text-3xl font-bold ${overallAverage !== 'N/A' && parseFloat(overallAverage) >= 4 ? 'text-green-600' : 'text-gray-900'}`}>
            {overallAverage !== 'N/A' ? `${overallAverage} / 5.0` : 'N/A'}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Top Skill</div>
          <div className="text-xl font-bold text-gray-900">{top}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Needs Focus</div>
          <div className="text-xl font-bold text-yellow-600">{weak}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Total Sessions</div>
          <div className="text-3xl font-bold text-gray-900">{progressNotes.length}</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Timeline</h2>
          
          {progressNotes.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <p className="text-gray-500">No progress notes yet. Click "Record Progress" to add one.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {progressNotes.map((note) => (
                <div key={note.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="flex justify-between px-6 py-4 border-b border-gray-200 text-sm">
                    <span className="font-semibold text-gray-900">{note.date}</span>
                    <span className="text-gray-600">By: {note.author}</span>
                  </div>
                  
                  <div className="p-6 space-y-5">
                    <p className="text-gray-800 italic bg-gray-50 p-4 rounded-lg leading-relaxed">
                      "{note.comment}"
                    </p>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Rubric Scores:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        {Object.entries(note.rubrics).map(([key, value]) => (
                          <div key={key} className="text-gray-600">
                            {getRubricLabel(key)}: 
                            <span className="ml-2 text-yellow-500 font-semibold text-base">
                              {renderStars(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {note.evidence && note.evidence.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Evidence:</h4>
                        <div className="flex flex-wrap gap-2">
                          {note.evidence.map((file, idx) => (
                            <a
                              key={idx}
                              href="#"
                              className="text-sm font-medium bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-200"
                            >
                              {file.type === 'pdf' ? '📄' : '📷'} {file.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Rubric Overview</h2>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              {averageRubrics ? (
                <>
                  <p className="text-sm text-gray-600 mb-4">Average scores from all sessions.</p>
                  <div className="space-y-4">
                    {Object.entries(averageRubrics).map(([key, value]) => {
                      const percentage = (parseFloat(value) / 5) * 100
                      return (
                        <div key={key}>
                          <div className="flex justify-between text-sm mb-1.5">
                            <span className="font-medium text-gray-900">{getRubricLabel(key)}</span>
                            <strong className="text-gray-600 text-xs">{value} / 5.0</strong>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${getRubricColor(parseFloat(value))}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-sm">No data available yet.</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">All Evidence</h2>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              {progressNotes.some(n => n.evidence && n.evidence.length > 0) ? (
                <div className="space-y-2">
                  {progressNotes.flatMap(n => n.evidence || []).map((file, idx) => (
                    <a key={idx} href="#" className="block text-sm text-blue-600 hover:text-blue-700 hover:underline">
                      {file.type === 'pdf' ? '📄' : '📷'} {file.name}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No evidence uploaded yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <RecordProgressModal 
        isOpen={isProgressModalOpen}
        onClose={() => setIsProgressModalOpen(false)}
        student={student}
        onProgressSaved={handleProgressSaved}
      />
      
      <CreateReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        student={student}
        progressNotes={progressNotes}
        averageRubrics={averageRubrics}
      />
    </div>
  )
}

export default StudentProfile
