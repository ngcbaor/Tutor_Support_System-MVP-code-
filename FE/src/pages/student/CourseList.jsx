import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mockCourses } from '../../data/mockCourses';

// SVG Icons for UI elements
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ResultIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

function CourseList() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Filter logic based on search term
  const filteredCourses = mockCourses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-900 mb-6">Registration</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          <div className="lg:col-span-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm min-h-[500px]">
              <h2 className="text-lg font-bold text-blue-900 mb-4">Course Registration</h2>

              <div className="flex flex-col md:flex-row gap-3 mb-6 items-center">
                <span className="text-sm text-gray-500 italic whitespace-nowrap">Select your courses</span>

                <div className="relative">
                  <select className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-3 pr-8 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm">
                    <option>All</option>
                    <option>Compulsory</option>
                    <option>Elective</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                  </div>
                </div>

                <div className="flex-1 relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon />
                  </div>
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <button className="px-4 py-2 border border-gray-300 rounded text-gray-600 text-sm hover:bg-gray-50 whitespace-nowrap">
                  Sort By Name
                </button>

                <button className="px-6 py-2 bg-[#1a237e] text-white rounded text-sm font-medium hover:bg-blue-900 shadow-sm">
                  Search
                </button>
              </div>

              <div className="space-y-4">
                {filteredCourses.map((course) => (
                  <div key={course.id} className="rounded-lg overflow-hidden border border-gray-200 shadow-sm flex flex-col">

                    <div className="bg-[#0d1b3e] p-4 flex justify-between items-center text-white">
                      <div>
                        <div className="text-xs text-gray-300 font-medium mb-1">{course.code}</div>
                        <h3 className="text-lg font-bold">{course.name}</h3>
                      </div>
                      <button
                        onClick={() => navigate(`/student/registration/${course.id}`)}
                        className="bg-[#0091ea] hover:bg-blue-500 text-white px-6 py-1.5 rounded text-sm font-semibold transition shadow-sm"
                      >
                        Select
                      </button>
                    </div>

                    <div className="bg-white p-2 flex justify-end border-t border-gray-100">
                      <Link
                        to={`/student/course/${course.id}`}
                        className="px-6 py-1 border border-gray-300 text-gray-600 rounded text-sm hover:bg-gray-50 transition"
                      >
                        Detail
                      </Link>
                    </div>
                  </div>
                ))}

                {filteredCourses.length === 0 && (
                  <p className="text-center text-gray-500 py-10">No courses found matching your criteria.</p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm h-full flex flex-col">
              <h2 className="text-lg font-bold text-blue-900 mb-4">Program Registration Management</h2>

              <div
                className="bg-white border border-gray-200 rounded-lg p-0 shadow-sm hover:shadow-md transition cursor-pointer flex overflow-hidden mb-4 group"
                onClick={() => navigate('/student/registration-management')}
              >
                <div className="bg-[#0d1b3e] w-20 flex items-center justify-center">
                  <ResultIcon />
                </div>
                <div className="flex-1 p-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-blue-900 font-bold text-base">Registration Result</h3>
                    <p className="text-gray-400 text-xs mt-1">View previous course registrations</p>
                  </div>
                  <div className="group-hover:translate-x-1 transition-transform">
                    <ChevronRightIcon />
                  </div>
                </div>
              </div>

              <div className="mt-auto space-y-2 opacity-50">
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default CourseList;