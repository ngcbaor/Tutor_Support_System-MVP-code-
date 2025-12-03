import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { 
  mockAllocationReportDetails, 
  mockAwardingReportDetails,
  formatReportScope,
  termOptions,
  facultyOptions,
  programOptions,
  cohortOptions
} from '../../data/mockReports';

export default function GenerateOverviewReport() {
  const [selectedReportType, setSelectedReportType] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [modalReportScope, setModalReportScope] = useState('');
  const [modalGeneratedDate, setModalGeneratedDate] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef(null);

  // Form state for Resource Allocation
  const [resTerm, setResTerm] = useState('sem1-2025');
  const [resFaculty, setResFaculty] = useState('cs');
  const [resProgram, setResProgram] = useState('all');

  // Form state for Student Summary
  const [stuTerm, setStuTerm] = useState('sem1-2025');
  const [stuFaculty, setStuFaculty] = useState('cs');
  const [stuProgram, setStuProgram] = useState('all');
  const [stuCohort, setStuCohort] = useState('all');

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const handleReportTypeClick = (type) => {
    setSelectedReportType(type);
    setShowMessage(false);
  };

  const handleBackToType = () => {
    setSelectedReportType(null);
    setShowMessage(false);
  };

  const handleGenerateReport = () => {
    let isValid = true;

    // Validate required fields
    if (selectedReportType === 'resource') {
      if (!resTerm || !resFaculty) isValid = false;
    } else {
      if (!stuTerm || !stuFaculty || !stuProgram || !stuCohort) isValid = false;
    }

    if (!isValid) {
      alert('Please select all required scope options (*).');
      return;
    }

    setShowMessage(true);

    // Simulate report generation
    setTimeout(() => {
      let scopeText;
      
      if (selectedReportType === 'student') {
        scopeText = formatReportScope('student', {
          term: stuTerm,
          faculty: stuFaculty,
          program: stuProgram,
          cohort: stuCohort
        });
      } else {
        scopeText = formatReportScope('resource', {
          term: resTerm,
          faculty: resFaculty,
          program: resProgram
        });
      }
      
      setModalReportScope(`Overview Report: ${scopeText}`);
      setModalGeneratedDate(`Generated on: ${formatDate(new Date())}`);
      setShowPreviewModal(true);
      setShowMessage(false);
    }, 1000);
  };

  const handleCloseModal = () => {
    setShowPreviewModal(false);
  };

  const handleExportReport = async () => {
    const reportElement = document.getElementById('overview-report-content')
    if (!reportElement) {
      alert('Report content not found. Please try again.');
      return;
    }
    
    const format = document.getElementById('report-format')?.value || 'pdf';
    setIsExporting(true);
    
    try {
      if (format === 'pdf') {
        // Clone the element first to avoid modifying the original preview
        const clonedElement = reportElement.cloneNode(true)
        clonedElement.id = 'overview-report-content-clone'
        
        // Create a comprehensive style override for the CLONED element only
        const printStyle = document.createElement('style')
        printStyle.textContent = `
          #overview-report-content-clone,
          #overview-report-content-clone * {
            color: #000000 !important;
            background-color: #ffffff !important;
            background-image: none !important;
            border-color: #cccccc !important;
            box-shadow: none !important;
            text-shadow: none !important;
            background: #ffffff !important;
          }
          
          /* Override all Tailwind background classes for clone only */
          #overview-report-content-clone .bg-gray-50 { background-color: #f9f9f9 !important; }
          #overview-report-content-clone .bg-gray-100 { background-color: #f3f3f3 !important; }
          #overview-report-content-clone .bg-gray-200 { background-color: #e5e5e5 !important; }
          #overview-report-content-clone .bg-white { background-color: #ffffff !important; }
          #overview-report-content-clone .bg-blue-50 { background-color: #f0f9ff !important; }
          #overview-report-content-clone .bg-blue-600 { background-color: #dddddd !important; }
          #overview-report-content-clone .bg-green-600 { background-color: #dddddd !important; }
          #overview-report-content-clone .bg-yellow-600 { background-color: #dddddd !important; }
          #overview-report-content-clone .bg-red-600 { background-color: #dddddd !important; }
          
          /* Override all Tailwind text color classes for clone only */
          #overview-report-content-clone .text-gray-600 { color: #666666 !important; }
          #overview-report-content-clone .text-gray-700 { color: #555555 !important; }
          #overview-report-content-clone .text-gray-800 { color: #333333 !important; }
          #overview-report-content-clone .text-gray-900 { color: #111111 !important; }
          #overview-report-content-clone .text-blue-600 { color: #000000 !important; font-weight: bold !important; }
          #overview-report-content-clone .text-green-600 { color: #000000 !important; font-weight: bold !important; }
          #overview-report-content-clone .text-yellow-600 { color: #000000 !important; font-weight: bold !important; }
          #overview-report-content-clone .text-red-600 { color: #000000 !important; font-weight: bold !important; }
          
          /* Override all Tailwind border classes for clone only */
          #overview-report-content-clone .border { border: 1px solid #cccccc !important; }
          #overview-report-content-clone .border-gray-200 { border-color: #e5e5e5 !important; }
          #overview-report-content-clone .border-gray-300 { border-color: #cccccc !important; }
          #overview-report-content-clone .border-blue-600 { border-color: #999999 !important; }
          
          /* Remove any CSS custom properties that might contain oklch for clone only */
          #overview-report-content-clone * {
            --tw-bg-opacity: 1 !important;
            --tw-text-opacity: 1 !important;
            --tw-border-opacity: 1 !important;
          }
        `
        document.head.appendChild(printStyle)
        document.body.appendChild(clonedElement)
        
        // Wait for styles to apply
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const canvas = await html2canvas(clonedElement, {
          scale: 1.2,
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          logging: false,
          width: clonedElement.scrollWidth,
          height: clonedElement.scrollHeight
        });
        
        // Clean up
        document.body.removeChild(clonedElement)
        document.head.removeChild(printStyle)
        
        if (!canvas || canvas.width === 0 || canvas.height === 0) {
          throw new Error('Canvas generation failed - no content captured')
        }
        
        const imgData = canvas.toDataURL('image/png', 0.9);
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        
        // Better scaling calculation
        const widthRatio = (pdfWidth - 20) / imgWidth;
        const heightRatio = (pdfHeight - 20) / imgHeight;
        const ratio = Math.min(widthRatio, heightRatio);
        
        const finalWidth = imgWidth * ratio;
        const finalHeight = imgHeight * ratio;
        const xOffset = (pdfWidth - finalWidth) / 2;
        const yOffset = 10;
        
        pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);
        
        const fileName = `Overview_Report_${selectedReportType || 'General'}_${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(fileName);
      } else {
        // Simple CSV export
        const csvContent = 'Report Type,Generated Date,Status\n' + 
          `${selectedReportType || 'General'},${new Date().toLocaleDateString()},Generated`;
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Overview_Report_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
      
      alert('Report exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      alert(`Export failed: ${error.message || 'Unknown error'}. Please try again.`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Generate Overview Report</h1>
      </div>

      {/* Step 1: Report Type Selection */}
      {!selectedReportType && (
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold text-center mb-8">Select Report Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => handleReportTypeClick('resource')}
              className="flex flex-col items-center text-center p-8 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md hover:border-blue-500 hover:-translate-y-1 transition-all duration-200"
            >
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Resource Allocation</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Analyze course performance, student demand, tutor workload, and student feedback for resource planning.
              </p>
            </button>
            <button
              onClick={() => handleReportTypeClick('student')}
              className="flex flex-col items-center text-center p-8 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md hover:border-blue-500 hover:-translate-y-1 transition-all duration-200"
            >
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Student Academic Summary</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Generate a list of students with Term GPA and assessments for scholarships or conduct points.
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Scope Selection */}
      {selectedReportType && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-gray-200">
            {selectedReportType === 'resource'
              ? 'Define Scope for Resource Allocation Report'
              : 'Define Scope for Student List Summary'}
          </h2>

          {/* Resource Filters */}
          {selectedReportType === 'resource' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="res-scope-term" className="text-sm font-semibold text-gray-900">
                  Term <span className="text-red-500 ml-0.5">*</span>
                </label>
                <select
                  id="res-scope-term"
                  value={resTerm}
                  onChange={(e) => setResTerm(e.target.value)}
                  className="w-full px-3.5 py-3 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-[url('data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20fill=%27none%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20stroke=%27%236b7280%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%271.5%27%20d=%27M6%208l4%204%204-4%27/%3e%3c/svg%3e')] bg-[length:1.2em_1.2em] bg-[right_0.75rem_center] bg-no-repeat pr-10"
                >
                  {termOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="res-scope-faculty" className="text-sm font-semibold text-gray-900">
                  Faculty/Department <span className="text-red-500 ml-0.5">*</span>
                </label>
                <select
                  id="res-scope-faculty"
                  value={resFaculty}
                  onChange={(e) => setResFaculty(e.target.value)}
                  className="w-full px-3.5 py-3 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-[url('data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20fill=%27none%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20stroke=%27%236b7280%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%271.5%27%20d=%27M6%208l4%204%204-4%27/%3e%3c/svg%3e')] bg-[length:1.2em_1.2em] bg-[right_0.75rem_center] bg-no-repeat pr-10"
                >
                  {facultyOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="res-scope-program" className="text-sm font-semibold text-gray-900">
                  Program (Optional - Default: All)
                </label>
                <select
                  id="res-scope-program"
                  value={resProgram}
                  onChange={(e) => setResProgram(e.target.value)}
                  className="w-full px-3.5 py-3 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-[url('data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20fill=%27none%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20stroke=%27%236b7280%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%271.5%27%20d=%27M6%208l4%204%204-4%27/%3e%3c/svg%3e')] bg-[length:1.2em_1.2em] bg-[right_0.75rem_center] bg-no-repeat pr-10"
                >
                  {programOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.value === 'all' ? 'All Programs within Faculty' : option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Student Filters */}
          {selectedReportType === 'student' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="stu-scope-term" className="text-sm font-semibold text-gray-900">
                  Term <span className="text-red-500 ml-0.5">*</span>
                </label>
                <select
                  id="stu-scope-term"
                  value={stuTerm}
                  onChange={(e) => setStuTerm(e.target.value)}
                  className="w-full px-3.5 py-3 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-[url('data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20fill=%27none%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20stroke=%27%236b7280%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%271.5%27%20d=%27M6%208l4%204%204-4%27/%3e%3c/svg%3e')] bg-[length:1.2em_1.2em] bg-[right_0.75rem_center] bg-no-repeat pr-10"
                >
                  {termOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="stu-scope-faculty" className="text-sm font-semibold text-gray-900">
                  Faculty/Department <span className="text-red-500 ml-0.5">*</span>
                </label>
                <select
                  id="stu-scope-faculty"
                  value={stuFaculty}
                  onChange={(e) => setStuFaculty(e.target.value)}
                  className="w-full px-3.5 py-3 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-[url('data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20fill=%27none%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20stroke=%27%236b7280%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%271.5%27%20d=%27M6%208l4%204%204-4%27/%3e%3c/svg%3e')] bg-[length:1.2em_1.2em] bg-[right_0.75rem_center] bg-no-repeat pr-10"
                >
                  {facultyOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="stu-scope-program" className="text-sm font-semibold text-gray-900">
                  Program <span className="text-red-500 ml-0.5">*</span>
                </label>
                <select
                  id="stu-scope-program"
                  value={stuProgram}
                  onChange={(e) => setStuProgram(e.target.value)}
                  className="w-full px-3.5 py-3 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-[url('data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20fill=%27none%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20stroke=%27%236b7280%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%271.5%27%20d=%27M6%208l4%204%204-4%27/%3e%3c/svg%3e')] bg-[length:1.2em_1.2em] bg-[right_0.75rem_center] bg-no-repeat pr-10"
                >
                  {programOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="stu-scope-cohort" className="text-sm font-semibold text-gray-900">
                  Cohort/Year <span className="text-red-500 ml-0.5">*</span>
                </label>
                <select
                  id="stu-scope-cohort"
                  value={stuCohort}
                  onChange={(e) => setStuCohort(e.target.value)}
                  className="w-full px-3.5 py-3 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-[url('data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20fill=%27none%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20stroke=%27%236b7280%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%271.5%27%20d=%27M6%208l4%204%204-4%27/%3e%3c/svg%3e')] bg-[length:1.2em_1.2em] bg-[right_0.75rem_center] bg-no-repeat pr-10"
                >
                  {cohortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleBackToType}
              className="px-5 py-2.5 text-sm font-semibold text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleGenerateReport}
              className="px-7 py-2.5 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              Generate Report
            </button>
          </div>
        </div>
      )}

      {/* Loading Message */}
      {showMessage && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 text-center p-12 mt-8">
          <p className="text-base text-gray-600">🔄 Generating report... Please wait.</p>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-[95%] max-w-[1140px] max-h-[90vh] flex flex-col overflow-hidden transform transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start p-5 px-8 border-b border-gray-200 bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-semibold mb-1">{modalReportScope}</h2>
                <p className="text-sm text-gray-600">{modalGeneratedDate}</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-900 text-3xl font-light leading-none ml-4"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
              <div className="p-8" id="overview-report-content" ref={reportRef}>
                {/* Export Controls */}
                <div className="flex justify-end items-center gap-4 pb-6 mb-6 border-b border-dashed border-gray-300">
                  <div className="flex items-center gap-2">
                    <label htmlFor="report-format" className="text-sm font-medium text-gray-900">
                      Format:
                    </label>
                    <select
                      id="report-format"
                      className="py-2 px-3 pr-8 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-[url('data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20fill=%27none%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20stroke=%27%236b7280%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%271.5%27%20d=%27M6%208l4%204%204-4%27/%3e%3c/svg%3e')] bg-[length:1.2em_1.2em] bg-[right_0.5rem_center] bg-no-repeat min-w-[100px]"
                    >
                      <option value="pdf">PDF</option>
                      <option value="csv">CSV</option>
                    </select>
                  </div>
                  <button
                    onClick={handleExportReport}
                    disabled={isExporting}
                    className="px-5 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex items-center gap-2"
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
                        Download
                      </>
                    )}
                  </button>
                </div>

                {/* Resource Allocation View */}
                {selectedReportType === 'resource' && (
                  <>
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                      <div className="flex items-start gap-4 bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-3xl flex-shrink-0 mt-1">📊</div>
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-600 mb-1.5">Scope Avg. Grade</div>
                          <div className="text-3xl font-bold text-gray-900 leading-tight">{mockAllocationReportDetails.kpis.avgGrade}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-3xl flex-shrink-0 mt-1">📉</div>
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-600 mb-1.5">Scope Failure Rate</div>
                          <div className="text-3xl font-bold text-amber-600 leading-tight">{mockAllocationReportDetails.kpis.failureRate}%</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-3xl flex-shrink-0 mt-1">🗣️</div>
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-600 mb-1.5">Avg. Student Feedback</div>
                          <div className="text-3xl font-bold text-gray-900 leading-tight">{mockAllocationReportDetails.kpis.avgFeedback}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-3xl flex-shrink-0 mt-1">🧑‍🏫</div>
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-600 mb-1.5">Avg. S/T Ratio</div>
                          <div className="text-3xl font-bold text-gray-900 leading-tight">{mockAllocationReportDetails.kpis.avgStudentTutorRatio}</div>
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
                            {mockAllocationReportDetails.courses.map((course, idx) => (
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
                            {mockAllocationReportDetails.tutors.map((tutor, idx) => (
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
                        {mockAllocationReportDetails.alerts.map((alert, idx) => (
                          <li key={idx} className={`flex items-start gap-4 p-4 px-5 rounded-lg ${
                            alert.type === 'danger' ? 'bg-red-50 border border-red-500 text-red-900' :
                            alert.type === 'warning' ? 'bg-amber-50 border border-amber-500 text-amber-900' :
                            'bg-blue-50 border border-blue-500 text-blue-900'
                          } text-sm leading-relaxed`}>
                            <div className="text-xl flex-shrink-0 leading-relaxed mt-0.5">
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
                  </>
                )}

                {/* Student Summary View */}
                {selectedReportType === 'student' && (
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
                          {mockAwardingReportDetails.students.map((student, idx) => (
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
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-5 px-8 bg-gray-50 border-t border-gray-200 sticky bottom-0 z-10">
              <button
                onClick={handleCloseModal}
                className="px-5 py-2.5 text-sm font-semibold text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}