import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  mockAwardingReports,
  termOptions,
  facultyOptions,
  programOptions,
  cohortOptions
} from '../../data/mockReports';

export default function ReportList() {
  const [filterTerm, setFilterTerm] = useState('sem1-2025');
  const [filterFaculty, setFilterFaculty] = useState('cs');
  const [filterProgram, setFilterProgram] = useState('all');
  const [filterCohort, setFilterCohort] = useState('all');

  const handleDownload = () => {
    alert('Simulating report download...');
  };

  // Filter reports based on selected criteria
  const filteredReports = mockAwardingReports.filter(report => {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Academic Summary Reports</h1>
        <p className="text-base text-gray-600">
          Browse and download generated reports for scholarship and conduct point evaluation.
        </p>
      </div>

      {/* Filter Section */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
        <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-gray-200 text-gray-900">
          Filter Reports
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-6">
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
          Available Reports (Student Summaries)
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
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                    No reports found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
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
                          onClick={handleDownload}
                          className="px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-lg transition-all"
                        >
                          Download
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
