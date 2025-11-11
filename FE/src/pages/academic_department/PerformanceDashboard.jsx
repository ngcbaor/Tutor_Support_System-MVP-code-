import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { termMapping, facultyMapping, programMapping, mockPerformanceCourses } from '../../data/mockReports';

export default function PerformanceDashboard() {
  const [searchParams] = useSearchParams();
  
  const term = searchParams.get('term') || 'sem1-2025';
  const faculty = searchParams.get('faculty') || 'cs';
  const program = searchParams.get('program') || 'cq';

  const [courses] = useState(mockPerformanceCourses);

  // Format scope text
  const getFormattedScope = () => {
    const termText = termMapping[term] || 'Semester 1 / 2025-2026';
    const facultyText = facultyMapping[faculty] || 'CS & Engineering';
    const programText = programMapping[program] || 'Regular Program';
    
    return `${facultyText} / ${termText} / ${programText}`;
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Performance Dashboard</h1>
        <p className="text-sm text-gray-600">
          Scope: {getFormattedScope()}
        </p>
      </div>

      {/* Course Overview Section */}
      <div className="mb-10">
        <h4 className="text-lg font-semibold mb-5 text-gray-900 pb-2.5 border-b border-gray-200">
          Course Overview
        </h4>
        <div className="overflow-x-auto rounded-lg bg-white shadow-sm border border-gray-200">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Enrollment
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Avg. Grade <span className="opacity-40 text-xs ml-1">↕️</span>
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Failure Rate <span className="opacity-40 text-xs ml-1">↕️</span>
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Participation % <span className="opacity-40 text-xs ml-1">↕️</span>
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  At-Risk Students <span className="opacity-40 text-xs ml-1">↕️</span>
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3.5 align-middle whitespace-nowrap">
                    <Link
                      to={`/academic-department/monitor-performance/course/${course.id}?term=${term}&faculty=${faculty}&program=${program}`}
                      className="font-semibold text-gray-900 hover:text-blue-600 hover:underline block"
                    >
                      {course.code} - {course.name}
                    </Link>
                    <small className="text-xs text-gray-500 mt-0.5 block">Tutors: {course.tutors}</small>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-gray-900 align-middle whitespace-nowrap">
                    {course.enrollment}
                  </td>
                  <td className={`px-6 py-3.5 text-sm font-semibold align-middle whitespace-nowrap ${
                    course.avgGrade < 7 ? 'text-amber-700' : 'text-gray-900'
                  }`}>
                    {course.avgGrade}
                  </td>
                  <td className={`px-6 py-3.5 text-sm align-middle whitespace-nowrap ${
                    course.failureRate > 15 ? 'text-red-700 font-medium' : 'text-gray-900'
                  }`}>
                    {course.failureRate}%
                  </td>
                  <td className={`px-6 py-3.5 text-sm align-middle whitespace-nowrap ${
                    course.participation < 80 ? 'text-amber-700 font-medium' : 'text-gray-900'
                  }`}>
                    {course.participation}%
                  </td>
                  <td className="px-6 py-3.5 align-middle whitespace-nowrap">
                    <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide border ${
                      course.riskLevel === 'high' 
                        ? 'bg-red-50 text-red-700 border-red-400' 
                        : course.riskLevel === 'medium'
                        ? 'bg-amber-50 text-amber-700 border-amber-400'
                        : 'bg-green-50 text-green-700 border-green-400'
                    }`}>
                      {course.atRiskCount}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right align-middle whitespace-nowrap">
                    <Link
                      to={`/academic-department/monitor-performance/course/${course.id}?term=${term}&faculty=${faculty}&program=${program}`}
                      className="inline-block px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      View Details
                    </Link>
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
