import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import { termOptions, facultyOptions, programOptions } from '../../data/mockReports';

export default function MonitorStudentPerformance() {
  const navigate = useNavigate();
  
  const [term, setTerm] = useState('sem1-2025');
  const [faculty, setFaculty] = useState('cs');
  const [program, setProgram] = useState('all');
  const [isExporting, setIsExporting] = useState(false);

  const handleExportScope = async () => {
    if (!term || !faculty || !program) {
      alert('Please select all required fields before exporting.');
      return;
    }

    setIsExporting(true);
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Add title
      pdf.setFontSize(20);
      pdf.setFont(undefined, 'bold');
      pdf.text('Student Performance Monitoring - Scope Summary', 20, 30);
      
      // Add date
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'normal');
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
      
      // Add line
      pdf.line(20, 55, 190, 55);
      
      // Add scope details
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.text('Selected Scope', 20, 70);
      
      pdf.setFontSize(11);
      pdf.setFont(undefined, 'normal');
      
      const termLabel = termOptions.find(opt => opt.value === term)?.label || term;
      const facultyLabel = facultyOptions.find(opt => opt.value === faculty)?.label || faculty;
      const programLabel = program === 'all' ? 'All Programs (within Faculty)' : 
        programOptions.find(opt => opt.value === program)?.label || program;
      
      pdf.text(`Term: ${termLabel}`, 20, 85);
      pdf.text(`Faculty/Department: ${facultyLabel}`, 20, 100);
      pdf.text(`Program: ${programLabel}`, 20, 115);
      
      // Add note
      pdf.setFontSize(10);
      pdf.text('Note: Use "View Dashboard" to access detailed performance metrics and reports.', 20, 140);
      
      const fileName = `Student_Performance_Scope_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      alert('Scope summary exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleViewDashboard = () => {
    // Validate that all required fields are selected
    if (!term || !faculty || !program) {
      alert('Please select all required fields.');
      return;
    }

    // Navigate to dashboard with query parameters
    navigate(`/academic-department/monitor-performance/dashboard?term=${term}&faculty=${faculty}&program=${program}`);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Monitor Student Performance</h1>
        <p className="text-sm text-gray-600">
          Select a scope to view aggregated metrics and identify at-risk students.
        </p>
      </div>

      {/* Scope Selector Card */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mx-auto" style={{ maxWidth: '800px', marginTop: '40px' }}>
        <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-gray-200 text-gray-900">
          Select Scope
        </h2>

        {/* Form Filters */}
        <div className="flex flex-col gap-6 mb-6">
          {/* Term */}
          <div className="flex flex-col gap-2">
            <label htmlFor="msp-scope-term" className="text-sm font-semibold text-gray-900">
              Term <span className="text-red-500 ml-0.5">*</span>
            </label>
            <select
              id="msp-scope-term"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full px-3.5 py-3 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-[url('data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20fill=%27none%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20stroke=%27%236b7280%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%271.5%27%20d=%27M6%208l4%204%204-4%27/%3e%3c/svg%3e')] bg-size-[1.2em_1.2em] bg-position-[right_0.75rem_center] bg-no-repeat pr-10"
            >
              {termOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Faculty/Department */}
          <div className="flex flex-col gap-2">
            <label htmlFor="msp-scope-faculty" className="text-sm font-semibold text-gray-900">
              Faculty/Department <span className="text-red-500 ml-0.5">*</span>
            </label>
            <select
              id="msp-scope-faculty"
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
              className="w-full px-3.5 py-3 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-[url('data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20fill=%27none%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20stroke=%27%236b7280%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%271.5%27%20d=%27M6%208l4%204%204-4%27/%3e%3c/svg%3e')] bg-size-[1.2em_1.2em] bg-position-[right_0.75rem_center] bg-no-repeat pr-10"
            >
              {facultyOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Program */}
          <div className="flex flex-col gap-2">
            <label htmlFor="msp-scope-program" className="text-sm font-semibold text-gray-900">
              Program <span className="text-red-500 ml-0.5">*</span>
            </label>
            <select
              id="msp-scope-program"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              className="w-full px-3.5 py-3 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-[url('data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20fill=%27none%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20stroke=%27%236b7280%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%271.5%27%20d=%27M6%208l4%204%204-4%27/%3e%3c/svg%3e')] bg-size-[1.2em_1.2em] bg-position-[right_0.75rem_center] bg-no-repeat pr-10"
            >
              <option value="all">All Programs (within Faculty)</option>
              {programOptions.filter(opt => opt.value !== 'all').map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
              <option value="vp">Việt-Pháp (PFIEV)</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <button
            onClick={handleExportScope}
            disabled={isExporting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isExporting ? 'Exporting...' : 'Export Scope'}
          </button>
          <button
            onClick={handleViewDashboard}
            className="px-7 py-3 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg transition-all"
          >
            View Dashboard
          </button>
        </div>
      </section>
    </div>
  );
}
