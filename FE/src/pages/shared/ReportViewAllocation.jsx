import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { getAllocationReportDetails } from '../../data/mockReports';

export default function ReportViewAllocation() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);

  const handleDownload = async () => {
    const reportElement = document.getElementById('allocation-report-content')
    if (!reportElement) {
      alert('Report content not found. Please try again.')
      return
    }
    
    const format = document.getElementById('report-format')?.value || 'pdf';
    setIsExporting(true)
    
    try {
      if (format === 'pdf') {
        // Clone the element first to avoid modifying the original preview
        const clonedElement = reportElement.cloneNode(true)
        clonedElement.id = 'allocation-report-content-clone'
        
        // Create a comprehensive style override for the CLONED element only
        const printStyle = document.createElement('style')
        printStyle.textContent = `
          #allocation-report-content-clone,
          #allocation-report-content-clone * {
            color: #000000 !important;
            background-color: #ffffff !important;
            background-image: none !important;
            border-color: #cccccc !important;
            box-shadow: none !important;
            text-shadow: none !important;
            background: #ffffff !important;
          }
          
          /* Override all Tailwind background classes for clone only */
          #allocation-report-content-clone .bg-gray-50 { background-color: #f9f9f9 !important; }
          #allocation-report-content-clone .bg-gray-100 { background-color: #f3f3f3 !important; }
          #allocation-report-content-clone .bg-white { background-color: #ffffff !important; }
          #allocation-report-content-clone .bg-amber-50 { background-color: #fffbeb !important; }
          #allocation-report-content-clone .bg-green-50 { background-color: #f0fdf4 !important; }
          
          /* Override all Tailwind text color classes for clone only */
          #allocation-report-content-clone .text-gray-600 { color: #666666 !important; }
          #allocation-report-content-clone .text-gray-700 { color: #555555 !important; }
          #allocation-report-content-clone .text-gray-900 { color: #111111 !important; }
          #allocation-report-content-clone .text-amber-600 { color: #000000 !important; font-weight: bold !important; }
          #allocation-report-content-clone .text-green-600 { color: #000000 !important; font-weight: bold !important; }
          #allocation-report-content-clone .text-blue-600 { color: #000000 !important; font-weight: bold !important; }
          
          /* Override all Tailwind border classes for clone only */
          #allocation-report-content-clone .border { border: 1px solid #cccccc !important; }
          #allocation-report-content-clone .border-gray-200 { border-color: #e5e5e5 !important; }
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
        
        // Better scaling calculation
        const widthRatio = (pdfWidth - 20) / imgWidth
        const heightRatio = (pdfHeight - 20) / imgHeight
        const ratio = Math.min(widthRatio, heightRatio)
        
        const finalWidth = imgWidth * ratio
        const finalHeight = imgHeight * ratio
        const xOffset = (pdfWidth - finalWidth) / 2
        const yOffset = 10
        
        pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight)
        
        const fileName = `Resource_Allocation_Report_${reportId}_${new Date().toISOString().split('T')[0]}.pdf`
        pdf.save(fileName)
      } else {
        // Simple CSV export
        const csvContent = 'Report Type,Generated Date,Status\n' + 
          `Resource Allocation,${new Date().toLocaleDateString()},Generated`;
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Resource_Allocation_Report_${reportId}_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
      
      alert('Report downloaded successfully!');
    } catch (error) {
      console.error('Export failed:', error)
      alert(`Export failed: ${error.message || 'Unknown error'}. Please try again.`)
    } finally {
      setIsExporting(false)
    }
  };

  // Get report data from mock data
  const reportDataFull = getAllocationReportDetails(reportId);
  
  if (!reportDataFull) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Report Not Found</h2>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Report List
          </button>
        </div>
      </div>
    );
  }

  const { scope, term, dateGenerated, generatedBy, details } = reportDataFull;
  const { kpis, courses, tutors, alerts } = details;

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-6">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2"
        >
          <span>←</span> Back to Report List
        </button>
      </div>

      {/* Export Controls */}
      <div className="flex justify-end items-center gap-4 pb-6 mb-6 border-b border-dashed border-gray-300">
        <div className="flex items-center gap-2">
          <label htmlFor="report-format" className="text-sm font-medium text-gray-900">
            Format:
          </label>
          <select
            id="report-format"
            className="py-2 px-3 pr-8 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-[url('data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20fill=%27none%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20stroke=%27%236b7280%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%271.5%27%20d=%27M6%208l4%204%204-4%27/%3e%3c/svg%3e')] bg-size-[1.2em_1.2em] bg-position-[right_0.5rem_center] bg-no-repeat min-w-[100px]"
          >
            <option value="pdf">PDF</option>
            <option value="csv">CSV</option>
          </select>
        </div>
        <button
          onClick={handleDownload}
          disabled={isExporting}
          className="px-5 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? 'Exporting...' : 'Download'}
        </button>
      </div>

      {/* Exportable Report Content */}
      <div id="allocation-report-content">
      {/* Report Header */}
      <div className="mb-8 pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Resource Allocation Report</h2>
        <p className="text-sm text-gray-600 mt-1">
          {scope} | {term} | Generated on {dateGenerated}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <div className="flex items-start gap-4 bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-3xl shrink-0 mt-1">📊</div>
          <div className="flex flex-col">
            <div className="text-sm font-medium text-gray-600 mb-1.5">Scope Avg. Grade</div>
            <div className="text-3xl font-bold text-gray-900 leading-tight">{kpis.avgGrade}</div>
          </div>
        </div>
        <div className="flex items-start gap-4 bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-3xl shrink-0 mt-1">📉</div>
          <div className="flex flex-col">
            <div className="text-sm font-medium text-gray-600 mb-1.5">Scope Failure Rate</div>
            <div className="text-3xl font-bold text-amber-600 leading-tight">{kpis.failureRate}%</div>
          </div>
        </div>
        <div className="flex items-start gap-4 bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-3xl shrink-0 mt-1">🗣️</div>
          <div className="flex flex-col">
            <div className="text-sm font-medium text-gray-600 mb-1.5">Avg. Student Feedback</div>
            <div className="text-3xl font-bold text-gray-900 leading-tight">{kpis.avgFeedback}</div>
          </div>
        </div>
        <div className="flex items-start gap-4 bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-3xl shrink-0 mt-1">🧑‍🏫</div>
          <div className="flex flex-col">
            <div className="text-sm font-medium text-gray-600 mb-1.5">Avg. S/T Ratio</div>
            <div className="text-3xl font-bold text-gray-900 leading-tight">{kpis.avgStudentTutorRatio}</div>
          </div>
        </div>
      </div>

      {/* Course Performance Table */}
      <div className="mb-10">
        <h4 className="text-lg font-semibold mb-5 pb-2.5 border-b border-gray-200 text-gray-900">
          Course Performance Analysis
        </h4>
        <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
                  Course
                </th>
                <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
                  Enrollment <span className="opacity-40 text-xs ml-1">↕️</span>
                </th>
                <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
                  # Sections
                </th>
                <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
                  Avg/Section
                </th>
                <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
                  Avg. Grade <span className="opacity-40 text-xs ml-1">↕️</span>
                </th>
                <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
                  Failure Rate <span className="opacity-40 text-xs ml-1">↕️</span>
                </th>
                <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
                  Avg. Feedback <span className="opacity-40 text-xs ml-1">↕️</span>
                </th>
                <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
                  # Tutors/TAs
                </th>
                <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
                  Avg. S/T Ratio
                </th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3.5 text-sm border-b border-gray-200 whitespace-nowrap">
                    {course.courseCode} - {course.courseName}
                  </td>
                  <td className="px-4 py-3.5 text-sm border-b border-gray-200 text-right font-medium">{course.totalStudents}</td>
                  <td className="px-4 py-3.5 text-sm border-b border-gray-200 text-right font-medium">{course.numSections}</td>
                  <td className="px-4 py-3.5 text-sm border-b border-gray-200 text-right font-medium">{course.avgPerSection}</td>
                  <td className={`px-4 py-3.5 text-sm border-b border-gray-200 text-right font-semibold ${
                    course.avgGrade < 7 ? 'text-amber-700' : ''
                  }`}>{course.avgGrade}</td>
                  <td className={`px-4 py-3.5 text-sm border-b border-gray-200 text-right font-medium ${
                    parseFloat(course.failureRate) > 15 ? 'text-red-700' : ''
                  }`}>{course.failureRate}</td>
                  <td className="px-4 py-3.5 text-sm border-b border-gray-200 text-right font-medium">{course.avgFeedback}</td>
                  <td className="px-4 py-3.5 text-sm border-b border-gray-200 text-right font-medium">{course.numTutors}</td>
                  <td className={`px-4 py-3.5 text-sm border-b border-gray-200 text-right font-medium ${
                    course.studentTutorRatio > 35 ? 'text-amber-700' : ''
                  }`}>{course.studentTutorRatio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tutor Workload Table */}
      <div className="mb-10">
        <h4 className="text-lg font-semibold mb-5 pb-2.5 border-b border-gray-200 text-gray-900">
          Tutor Workload & Feedback Summary
        </h4>
        <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
                  Tutor
                </th>
                <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
                  # Courses
                </th>
                <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
                  Total Students
                </th>
                <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
                  Avg. Student Feedback <span className="opacity-40 text-xs ml-1">↕️</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {tutors.map((tutor, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3.5 text-sm border-b border-gray-200">{tutor.tutorName}</td>
                  <td className="px-4 py-3.5 text-sm border-b border-gray-200 text-right">{tutor.numCourses}</td>
                  <td className="px-4 py-3.5 text-sm border-b border-gray-200 text-right">{tutor.totalStudents}</td>
                  <td className={`px-4 py-3.5 text-sm border-b border-gray-200 text-right ${
                    parseFloat(tutor.avgFeedback) < 4.0 ? 'text-amber-700' : ''
                  }`}>{tutor.avgFeedback}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts */}
      <div>
        <h4 className="text-lg font-semibold mb-5 pb-2.5 border-b border-gray-200 text-gray-900">
          Alerts & Allocation Suggestions
        </h4>
        <ul className="flex flex-col gap-4">
          {alerts.map((alert, idx) => (
            <li key={idx} className={`flex items-start gap-4 p-4 px-5 rounded-lg ${
              alert.type === 'danger' ? 'bg-red-50 border border-red-500 text-red-900' :
              alert.type === 'warning' ? 'bg-amber-50 border border-amber-500 text-amber-900' :
              'bg-blue-50 border border-blue-500 text-blue-900'
            } text-sm leading-relaxed`}>
              <div className="text-xl shrink-0 leading-relaxed mt-0.5">
                {alert.type === 'danger' ? '❗️' : alert.type === 'warning' ? '⚠️' : 'ℹ️'}
              </div>
              <div className="flex-1">
                <strong className="font-semibold text-gray-900 mr-1">{alert.title}:</strong>
                {alert.message}
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* End Exportable Content */}
      </div>
    </div>
  );
}
