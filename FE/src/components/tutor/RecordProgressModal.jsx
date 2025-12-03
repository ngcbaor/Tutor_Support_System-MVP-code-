import { useState } from 'react'

function RecordProgressModal({ isOpen, onClose, student, onProgressSaved }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    topicMastery: null,
    problemSolving: null,
    participation: null,
    studySkills: null,
    homework: null,
    comment: '',
    files: []
  })

  const [fileError, setFileError] = useState('')

  if (!isOpen) return null

  const rubrics = [
    { key: 'topicMastery', label: 'Topic Mastery' },
    { key: 'problemSolving', label: 'Problem Solving' },
    { key: 'participation', label: 'Participation' },
    { key: 'studySkills', label: 'Study Skills' },
    { key: 'homework', label: 'Homework' }
  ]

  const handleRubricChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']
    
    const invalidFiles = files.filter(f => !allowedTypes.includes(f.type))
    
    if (invalidFiles.length > 0) {
      setFileError('❌ Error: Only PDF, JPG, and PNG files are allowed.')
      e.target.value = null
    } else {
      setFileError('')
      setFormData(prev => ({ ...prev, files }))
    }
  }

  const handleSave = () => {
    // Validation
    const hasAllRubrics = rubrics.every(r => formData[r.key] !== null)
    if (!formData.date || !hasAllRubrics || !formData.comment.trim()) {
      alert('Please fill in all required fields.')
      return
    }

    // Create new progress note
    const newProgressNote = {
      id: Date.now(), // Simple ID for demo
      date: formData.date,
      author: 'Nguyễn Văn A', // In real app, this would be from auth
      comment: formData.comment,
      rubrics: {
        topicMastery: formData.topicMastery,
        problemSolving: formData.problemSolving,
        participation: formData.participation,
        studySkills: formData.studySkills,
        homework: formData.homework
      },
      evidence: formData.files.map(file => ({
        name: file.name,
        type: file.type.includes('pdf') ? 'pdf' : 'image'
      }))
    }

    // Call the callback to update parent state
    if (onProgressSaved) {
      onProgressSaved(newProgressNote)
    }

    alert('Progress recorded successfully!')
    onClose()
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      topicMastery: null,
      problemSolving: null,
      participation: null,
      studySkills: null,
      homework: null,
      comment: '',
      files: []
    })
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Record Session Progress</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Student: {student.name} ({student.id})
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-3xl font-light leading-none"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Session / Date<span className="text-red-600 ml-1">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Rubrics */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Rubric Scores<span className="text-red-600 ml-1">*</span>
                </label>
                <div className="space-y-4">
                  {rubrics.map((rubric) => (
                    <div key={rubric.key} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-white border border-gray-200 rounded-lg">
                      <span className="text-sm font-medium text-gray-900">{rubric.label}</span>
                      <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => handleRubricChange(rubric.key, value)}
                            className={`
                              px-4 py-2 text-sm font-semibold transition-colors border-l border-gray-300 first:border-l-0
                              ${formData[rubric.key] === value 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                              }
                            `}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Tutor's Comments<span className="text-red-600 ml-1">*</span>
                </label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                  rows="4"
                  placeholder="Enter detailed comments..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Supporting Evidence (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-blue-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-gray-600 mb-1">
                      Drag and drop files here, or <label htmlFor="file-upload" className="text-blue-600 font-semibold cursor-pointer hover:text-blue-700">browse files</label>
                    </p>
                    <p className="text-xs text-gray-500">Supports: PDF, JPG, PNG</p>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </div>
                {formData.files.length > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    File(s) selected: {formData.files.map(f => f.name).join(', ')}
                  </p>
                )}
                {fileError && (
                  <p className="text-sm text-red-600 font-medium mt-2">{fileError}</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 bg-gray-50 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Save Record
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default RecordProgressModal
