import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { 
  mockAllocationReports, 
  mockAwardingReports,
  termOptions,
  facultyOptions,
  programOptions,
  cohortOptions
} from '../../data/mockReports';

export default function ReportList() {
  const [activeTab, setActiveTab] = useState('allocation'); // 'allocation' or 'awarding'
  const [filterTerm, setFilterTerm] = useState('sem1-2025');
  const [filterFaculty, setFilterFaculty] = useState('cs');
  const [filterProgram, setFilterProgram] = useState('all');
  const [filterCohort, setFilterCohort] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef(null);

  const handleDownload = async (reportData, reportType) => {
    setIsExporting(true);
    
    try {
      // Simple PDF generation without html2canvas complexity
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Add title
      pdf.setFontSize(20);
      pdf.setFont(undefined, 'bold');
      pdf.text(`${reportType} Report`, 20, 30);
      
      // Add date
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'normal');
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
      
      // Add line
      pdf.line(20, 55, 190, 55);
      
      // Add report details
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.text('Report Details', 20, 70);
      
      pdf.setFontSize(11);
      pdf.setFont(undefined, 'normal');
      pdf.text(`Term: ${reportData.term}`, 20, 85);
      pdf.text(`Faculty: ${reportData.faculty}`, 20, 95);
      pdf.text(`Program: ${reportData.program}`, 20, 105);
      pdf.text(`Generated: ${reportData.generatedDate}`, 20, 115);
      
      // Add scope
      pdf.text(`Scope: ${reportData.scope}`, 20, 130);
      
      // Add summary
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text('Summary:', 20, 150);
      
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      const summaryText = 'This report contains detailed analysis for the selected criteria. Please refer to the full system for complete data visualization and interactive features.';
      const splitSummary = pdf.splitTextToSize(summaryText, 170);
      pdf.text(splitSummary, 20, 165);
      
      const fileName = `${reportType.replace(/\s+/g, '_')}_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      alert('Report downloaded successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      alert(`Export failed: ${error.message || 'Unknown error'}. Please try again.`);
    } finally {
      setIsExporting(false);
    }
  };

  // Filter allocation reports
  const filteredAllocationReports = mockAllocationReports.filter(report => {
    if (filterTerm !== 'all' && report.termValue !== filterTerm) return false;
    if (filterFaculty !== 'all' && report.facultyValue !== filterFaculty) return false;
    if (filterProgram !== 'all' && report.programValue !== filterProgram) return false;
    return true;
  });

  // Filter awarding reports
  const filteredAwardingReports = mockAwardingReports.filter(report => {
    if (filterTerm !== 'all' && report.termValue !== filterTerm) return false;
    if (filterFaculty !== 'all' && report.facultyValue !== filterFaculty) return false;
    if (filterProgram !== 'all' && report.programValue !== filterProgram) return false;
    if (filterCohort !== 'all' && report.cohortValue !== filterCohort) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Generated Reports</h1>
        <p className="text-base text-gray-600">
          Browse and download resource allocation and student academic summary reports.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab('allocation')}
            className={`pb-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
              activeTab === 'allocation'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
            }`}
          >
            Resource Allocation Reports
          </button>
          <button
            onClick={() => setActiveTab('awarding')}
            className={`pb-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
              activeTab === 'awarding'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
            }`}
          >
            Student Academic Summaries
          </button>
        </nav>
      </div>

      {/* Filter Section */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
        <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-gray-200 text-gray-900">
          Filter Reports
        </h2>
        <div className={`grid grid-cols-1 md:grid-cols-2 ${activeTab === 'awarding' ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-8 mb-6`}>
          <div className="flex flex-col gap-2">
            <label htmlFor="filter-term" className="text-sm font-semibold text-gray-900">
              Term
            </label>
            <select
              id="filter-term"
              value={filterTerm}
              onChange={(e) => setFilterTerm(e.target.value)}
              className="w-full px-3.5 py-3 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-[url('data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20fill=%27none%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20stroke=%27%236b7280%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%271.5%27%20d=%27M6%208l4%204%204-4%27/%3e%3c/svg%3e')] bg-size-[1.2em_1.2em] bg-position-[right_0.75rem_center] bg-no-repeat pr-10"
            >
              <option value="all">All Terms</option>
              {termOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="filter-faculty" className="text-sm font-semibold text-gray-900">
              Faculty/Department
            </label>
            <select
              id="filter-faculty"
              value={filterFaculty}
              onChange={(e) => setFilterFaculty(e.target.value)}
              className="w-full px-3.5 py-3 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-[url('data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20fill=%27none%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20stroke=%27%236b7280%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%271.5%27%20d=%27M6%208l4%204%204-4%27/%3e%3c/svg%3e')] bg-size-[1.2em_1.2em] bg-position-[right_0.75rem_center] bg-no-repeat pr-10"
            >
              <option value="all">All Faculties</option>
              {facultyOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="filter-program" className="text-sm font-semibold text-gray-900">
              Program
            </label>
            <select
              id="filter-program"
              value={filterProgram}
              onChange={(e) => setFilterProgram(e.target.value)}
              className="w-full px-3.5 py-3 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-[url('data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20fill=%27none%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20stroke=%27%236b7280%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%271.5%27%20d=%27M6%208l4%204%204-4%27/%3e%3c/svg%3e')] bg-size-[1.2em_1.2em] bg-position-[right_0.75rem_center] bg-no-repeat pr-10"
            >
              {programOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          {activeTab === 'awarding' && (
            <div className="flex flex-col gap-2">
              <label htmlFor="filter-cohort" className="text-sm font-semibold text-gray-900">
                Cohort/Year
              </label>
              <select
                id="filter-cohort"
                value={filterCohort}
                onChange={(e) => setFilterCohort(e.target.value)}
                className="w-full px-3.5 py-3 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-[url('data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20fill=%27none%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20stroke=%27%236b7280%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%271.5%27%20d=%27M6%208l4%204%204-4%27/%3e%3c/svg%3e')] bg-size-[1.2em_1.2em] bg-position-[right_0.75rem_center] bg-no-repeat pr-10"
              >
                {cohortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg transition-all">
            Search
          </button>
        </div>
      </section>

      {/* Report List Section */}
      <div className="mb-10">
        <h4 className="text-lg font-semibold mb-5 pb-2.5 border-b border-gray-200 text-gray-900">
          {activeTab === 'allocation' ? 'Available Reports (Resource Allocation)' : 'Available Reports (Student Summaries)'}
        </h4>
        <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
                  Report Scope / Name
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
                  Date Generated
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
                  Generated By
                </th>
                <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {activeTab === 'allocation' ? (
                filteredAllocationReports.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                      No allocation reports found matching the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredAllocationReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3.5 border-b border-gray-200">
                        <Link
                          to={`/report/allocation/${report.id}`}
                          className="text-gray-900 font-semibold no-underline hover:text-blue-600 hover:underline"
                        >
                          {report.scope}
                        </Link>
                        <small className="text-xs text-gray-600 block mt-0.5">{report.term}</small>
                      </td>
                      <td className="px-4 py-3.5 text-sm border-b border-gray-200">{report.dateGenerated}</td>
                      <td className="px-4 py-3.5 text-sm border-b border-gray-200">{report.generatedBy}</td>
                      <td className="px-4 py-3.5 border-b border-gray-200">
                        <div className="flex gap-2 justify-end">
                          <Link
                            to={`/report/allocation/${report.id}`}
                            className="px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors no-underline"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => handleDownload(report, 'Resource_Allocation')}
                            disabled={isExporting}
                            className="px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex items-center gap-1"
                          >
                            {isExporting ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                <span>Exporting...</span>
                              </>
                            ) : (
                              <>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Download
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )
              ) : (
                filteredAwardingReports.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                      No student summary reports found matching the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredAwardingReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3.5 border-b border-gray-200">
                        <Link
                          to={`/report/awarding/${report.id}`}
                          className="text-gray-900 font-semibold no-underline hover:text-blue-600 hover:underline"
                        >
                          {report.scope}
                        </Link>
                        <small className="text-xs text-gray-600 block mt-0.5">{report.term}</small>
                      </td>
                      <td className="px-4 py-3.5 text-sm border-b border-gray-200">{report.dateGenerated}</td>
                      <td className="px-4 py-3.5 text-sm border-b border-gray-200">{report.generatedBy}</td>
                      <td className="px-4 py-3.5 border-b border-gray-200">
                        <div className="flex gap-2 justify-end">
                          <Link
                            to={`/report/awarding/${report.id}`}
                            className="px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors no-underline"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => handleDownload(report, 'Student_Academic_Summary')}
                            disabled={isExporting}
                            className="px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex items-center gap-1"
                          >
                            {isExporting ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                <span>Exporting...</span>
                              </>
                            ) : (
                              <>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Download
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
