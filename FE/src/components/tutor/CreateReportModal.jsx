import { useState, useRef } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

function CreateReportModal({ isOpen, onClose, student, progressNotes, averageRubrics }) {
  const [step, setStep] = useState(1)
  const [isExporting, setIsExporting] = useState(false)
  const reportRef = useRef(null)
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

  const handleExport = async () => {
    const reportElement = document.getElementById('report-preview-content')
    if (!reportElement) {
      alert('Report content not found. Please try again.')
      return
    }
    
    setIsExporting(true)
    
    try {
      // Clone the element first to avoid modifying the original preview
      const clonedElement = reportElement.cloneNode(true)
      clonedElement.id = 'report-preview-content-clone'
      
      // Create a comprehensive style override for the CLONED element only
      const printStyle = document.createElement('style')
      printStyle.textContent = `
        #report-preview-content-clone,
        #report-preview-content-clone * {
          color: #000000 !important;
          background-color: #ffffff !important;
          background-image: none !important;
          border-color: #cccccc !important;
          box-shadow: none !important;
          text-shadow: none !important;
          background: #ffffff !important;
        }
        
        /* Override all Tailwind background classes for clone only */
        #report-preview-content-clone .bg-gray-50 { background-color: #f9f9f9 !important; }
        #report-preview-content-clone .bg-gray-100 { background-color: #f3f3f3 !important; }
        #report-preview-content-clone .bg-gray-200 { background-color: #e5e5e5 !important; }
        #report-preview-content-clone .bg-white { background-color: #ffffff !important; }
        #report-preview-content-clone .bg-blue-50 { background-color: #f0f9ff !important; }
        #report-preview-content-clone .bg-blue-600 { background-color: #dddddd !important; }
        #report-preview-content-clone .bg-green-600 { background-color: #dddddd !important; }
        #report-preview-content-clone .bg-yellow-600 { background-color: #dddddd !important; }
        #report-preview-content-clone .bg-red-600 { background-color: #dddddd !important; }
        
        /* Override all Tailwind text color classes for clone only */
        #report-preview-content-clone .text-gray-600 { color: #666666 !important; }
        #report-preview-content-clone .text-gray-700 { color: #555555 !important; }
        #report-preview-content-clone .text-gray-800 { color: #333333 !important; }
        #report-preview-content-clone .text-gray-900 { color: #111111 !important; }
        #report-preview-content-clone .text-blue-600 { color: #000000 !important; font-weight: bold !important; }
        #report-preview-content-clone .text-green-600 { color: #000000 !important; font-weight: bold !important; }
        #report-preview-content-clone .text-yellow-600 { color: #000000 !important; font-weight: bold !important; }
        #report-preview-content-clone .text-red-600 { color: #000000 !important; font-weight: bold !important; }
        
        /* Override all Tailwind border classes for clone only */
        #report-preview-content-clone .border { border: 1px solid #cccccc !important; }
        #report-preview-content-clone .border-gray-200 { border-color: #e5e5e5 !important; }
        #report-preview-content-clone .border-gray-300 { border-color: #cccccc !important; }
        #report-preview-content-clone .border-blue-600 { border-color: #999999 !important; }
        
        /* Remove any CSS custom properties that might contain oklch for clone only */
        #report-preview-content-clone * {
          --tw-bg-opacity: 1 !important;
          --tw-text-opacity: 1 !important;
          --tw-border-opacity: 1 !important;
        }
      `
      document.head.appendChild(printStyle)
      document.body.appendChild(clonedElement)
      
      // Wait for styles to apply
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const canvas = await html2canvas(clonedElement, {
        scale: 1.2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        width: clonedElement.scrollWidth,
        height: clonedElement.scrollHeight
      })
      
      // Clean up
      document.body.removeChild(clonedElement)
      document.head.removeChild(printStyle)
      
      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas generation failed - no content captured')
      }
      
      const imgData = canvas.toDataURL('image/png', 0.9)
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      
      // Calculate scaling to fit page
      const widthRatio = (pdfWidth - 20) / imgWidth
      const heightRatio = (pdfHeight - 20) / imgHeight
      const ratio = Math.min(widthRatio, heightRatio)
      
      const finalWidth = imgWidth * ratio
      const finalHeight = imgHeight * ratio
      const xOffset = (pdfWidth - finalWidth) / 2
      const yOffset = 10
      
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight)
      
      // Generate filename with student name and date
      const fileName = `Student_Report_${student.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
      pdf.save(fileName)
      
      alert('Report exported successfully!')
      onClose()
      setStep(1)
      setFormData({
        startDate: '',
        endDate: new Date().toISOString().split('T')[0],
        comment: ''
      })
    } catch (error) {
      console.error('Export failed:', error)
      alert(`Export failed: ${error.message}. Please try again.`)
    } finally {
      setIsExporting(false)
    }
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

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-8" id="report-preview-content" ref={reportRef}>
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
                    disabled={isExporting}
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex items-center gap-2"
                  >
                    {isExporting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Exporting...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download PDF
                      </>
                    )}
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
