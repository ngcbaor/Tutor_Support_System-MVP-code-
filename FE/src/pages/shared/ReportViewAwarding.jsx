import { useParams, useNavigate } from 'react-router-dom';
import { getAwardingReportDetails } from '../../data/mockReports';

export default function ReportViewAwarding() {
  const { reportId } = useParams();
  const navigate = useNavigate();

  const handleDownload = () => {
    alert('Simulating report download...');
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
          className="px-5 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-lg transition-all"
        >
          Download
        </button>
      </div>

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
