import { useState } from 'react'

function CreateReportModal({ isOpen, onClose, student, progressNotes, averageRubrics }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: new Date().toISOString().split('T')[0],
    comment: ''
  })

  if (!isOpen) return null

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

  const getRubricColor = (score) => {
    if (score >= 4) return 'bg-green-600'
    if (score >= 3) return 'bg-blue-600'
    return 'bg-yellow-600'
  }

  const handleGeneratePreview = () => {
    if (!formData.startDate || !formData.endDate || !formData.comment.trim()) {
      alert('Please fill in all required fields.')
      return
    }
    setStep(2)
  }

  const handleBack = () => {
    setStep(1)
  }

  const handleExport = () => {
    alert('Exporting report as PDF/CSV...')
    onClose()
    setStep(1)
    setFormData({
      startDate: '',
      endDate: new Date().toISOString().split('T')[0],
      comment: ''
    })
  }

  const handleClose = () => {
    onClose()
    setStep(1)
    setFormData({
      startDate: '',
      endDate: new Date().toISOString().split('T')[0],
      comment: ''
    })
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Generate Course Report</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Student: {student.name} ({student.id})
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 text-3xl font-light leading-none"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="text-base font-semibold text-gray-900 pb-2 border-b border-gray-200">
                    1. Select Range & Add Comment
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Date Range (Start)<span className="text-red-600 ml-1">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Date Range (End)<span className="text-red-600 ml-1">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Overall Comment<span className="text-red-600 ml-1">*</span>
                    </label>
                    <textarea
                      value={formData.comment}
                      onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                      rows="4"
                      placeholder="Enter an overall summary..."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 max-h-[60vh] overflow-y-auto">
                  <h3 className="text-base font-semibold text-gray-900 pb-2 border-b border-gray-200">
                    2. Preview Report
                  </h3>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
                    {/* Report Header */}
                    <div className="border-b border-gray-300 pb-4 mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Student Progress Report</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Generated on: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>

                    {/* Meta Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 pb-4 border-b border-gray-300 text-sm">
                      <div className="text-gray-600">
                        <strong className="text-gray-900">Student:</strong> {student.name} ({student.id})
                      </div>
                      <div className="text-gray-600">
                        <strong className="text-gray-900">Course:</strong> Advanced Web Programming (IT4409)
                      </div>
                      <div className="text-gray-600">
                        <strong className="text-gray-900">Report Period:</strong> {formData.startDate} - {formData.endDate}
                      </div>
                    </div>

                    {progressNotes.length === 0 ? (
                      <div className="text-center py-8 bg-yellow-50 border border-yellow-600 rounded-lg">
                        <p className="text-yellow-700 font-medium">⚠️ No progress notes found for the selected date range.</p>
                      </div>
                    ) : (
                      <>
                        {/* Overall Comment */}
                        <div className="mb-6">
                          <h4 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-300">
                            Tutor's Overall Comment
                          </h4>
                          <blockquote className="border-l-4 border-blue-600 pl-4 text-gray-800 leading-relaxed">
                            "{formData.comment}"
                          </blockquote>
                        </div>

                        {/* Rubric Performance */}
                        {averageRubrics && (
                          <div className="mb-6">
                            <h4 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-300">
                              Rubric Performance (Average Scores)
                            </h4>
                            <div className="space-y-3">
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
                          </div>
                        )}

                        {/* Session Notes Summary */}
                        <div className="mb-6">
                          <h4 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-300">
                            Session Notes Summary
                          </h4>
                          <div className="space-y-3">
                            {progressNotes.map((note) => (
                              <div key={note.id} className="bg-white border border-gray-300 rounded-lg p-4">
                                <span className="block text-xs font-semibold text-gray-600 mb-2">{note.date}</span>
                                <p className="text-sm text-gray-800 leading-relaxed">"{note.comment}"</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Evidence */}
                        <div>
                          <h4 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-300">
                            Supporting Evidence
                          </h4>
                          {progressNotes.some(n => n.evidence && n.evidence.length > 0) ? (
                            <>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {progressNotes.flatMap(n => n.evidence || []).map((file, idx) => (
                                  <a
                                    key={idx}
                                    href="#"
                                    className="inline-flex items-center gap-1 text-sm font-medium bg-white border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"
                                  >
                                    <span>{file.type === 'pdf' ? '📄' : '📷'}</span>
                                    {file.name}
                                  </a>
                                ))}
                              </div>
                              <p className="text-xs text-gray-600">
                                Total files uploaded during this period: {progressNotes.flatMap(n => n.evidence || []).length}
                              </p>
                            </>
                          ) : (
                            <p className="text-sm text-gray-500">No evidence files uploaded.</p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 bg-gray-50 border-t border-gray-200">
              {step === 1 && (
                <>
                  <button
                    onClick={handleClose}
                    className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleGeneratePreview}
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Generate Preview
                  </button>
                </>
              )}
              {step === 2 && (
                <>
                  <button
                    onClick={handleBack}
                    className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Back to Edit
                  </button>
                  <button
                    onClick={handleExport}
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Export as PDF/CSV
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CreateReportModal
