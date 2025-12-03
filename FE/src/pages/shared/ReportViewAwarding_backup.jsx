import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { getAwardingReportDetails } from '../../data/mockReports';

export default function ReportViewAwarding() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);

  const handleDownload = async () => {
    const reportElement = document.getElementById('awarding-report-content')
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
        clonedElement.id = 'awarding-report-content-clone'
        
        // Create a comprehensive style override for the CLONED element only
        const printStyle = document.createElement('style')
        printStyle.textContent = `
          #awarding-report-content-clone,
          #awarding-report-content-clone * {
            color: #000000 !important;
            background-color: #ffffff !important;
            background-image: none !important;
            border-color: #cccccc !important;
            box-shadow: none !important;
            text-shadow: none !important;
            background: #ffffff !important;
          }
          
          /* Override all Tailwind background classes for clone only */
          #awarding-report-content-clone .bg-gray-50 { background-color: #f9f9f9 !important; }
          #awarding-report-content-clone .bg-white { background-color: #ffffff !important; }
          #awarding-report-content-clone .bg-green-50 { background-color: #f0fdf4 !important; }
          #awarding-report-content-clone .bg-blue-50 { background-color: #eff6ff !important; }
          
          /* Override all Tailwind text color classes for clone only */
          #awarding-report-content-clone .text-gray-600 { color: #666666 !important; }
          #awarding-report-content-clone .text-gray-700 { color: #555555 !important; }
          #awarding-report-content-clone .text-gray-900 { color: #111111 !important; }
          #awarding-report-content-clone .text-green-700 { color: #000000 !important; font-weight: bold !important; }
          #awarding-report-content-clone .text-blue-700 { color: #000000 !important; font-weight: bold !important; }
          
          /* Override all Tailwind border classes for clone only */
          #awarding-report-content-clone .border { border: 1px solid #cccccc !important; }
          #awarding-report-content-clone .border-gray-200 { border-color: #e5e5e5 !important; }
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
        
        const fileName = `Student_Academic_Summary_Report_${reportId}_${new Date().toISOString().split('T')[0]}.pdf`
        pdf.save(fileName)
      } else {
        // Simple CSV export
        const csvContent = 'Report Type,Generated Date,Status\n' + 
          `Student Academic Summary,${new Date().toLocaleDateString()},Generated`;
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Student_Academic_Summary_Report_${reportId}_${new Date().toISOString().split('T')[0]}.csv`;
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
  const reportDataFull = getAwardingReportDetails(reportId);
  
  if (!reportDataFull) {
    return (
      <div className="min-h-screen bg-white p-8">
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
  const { students } = details;

  return (
    <div className="min-h-screen bg-white px-8 py-6">
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
      <div id="awarding-report-content">
      {/* Report Header */}
      <div className="mb-8 pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Student Academic Summary Report</h2>
        <p className="text-sm text-gray-600 mt-1">
          {scope} | {term} | Generated on {dateGenerated}
        </p>
      </div>

      {/* Student List Summary */}
      <div>
        <h4 className="text-lg font-semibold mb-5 pb-2.5 border-b border-gray-200 text-gray-900">
          Student List Summary
        </h4>
        <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
                  No.
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
                  Student ID
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
                  Full Name
                </th>
                <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
                  Term GPA (4.0) <span className="opacity-40 text-xs ml-1">↕️</span>
                </th>
                <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
                  Term GPA (10.0) <span className="opacity-40 text-xs ml-1">↕️</span>
                </th>
                <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
                  Avg. Tutor Assessment
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3.5 text-sm border-b border-gray-200">{idx + 1}</td>
                  <td className="px-4 py-3.5 text-sm border-b border-gray-200">{student.studentId}</td>
                  <td className="px-4 py-3.5 text-sm border-b border-gray-200">{student.fullName}</td>
                  <td className="px-4 py-3.5 text-sm border-b border-gray-200 text-right font-semibold text-blue-600">
                    {student.gpa4}
                  </td>
                  <td className="px-4 py-3.5 text-sm border-b border-gray-200 text-right font-semibold">{student.gpa10}</td>
                  <td className="px-4 py-3.5 text-sm border-b border-gray-200 text-right font-semibold">
                    {student.avgTutorAssessment}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
