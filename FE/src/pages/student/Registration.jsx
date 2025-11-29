import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { mockCourses } from '../../data/mockCourses';

function Registration() {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = mockCourses.find(c => c.id === id);

  const [showAutoMatch, setShowAutoMatch] = useState(false);

  const [filterRole, setFilterRole] = useState('All');

  const [searchTutor, setSearchTutor] = useState('');

  if (!course) return <div className="p-6 text-center text-red-500">Course not found</div>;


  const filteredClasses = course.classes.filter(cls => {
    const matchRole = filterRole === 'All' || cls.role === filterRole;
    const matchName = cls.tutor.toLowerCase().includes(searchTutor.toLowerCase());
    return matchRole && matchName;
  });

  const handleRegister = (cls) => {
    alert(`Successfully registered for class ${cls.id} with Tutor ${cls.tutor}.`);

  };

  const handleAutoMatchSubmit = (e) => {
    e.preventDefault();
    setShowAutoMatch(false);
    alert("Auto-matching request submitted! We will notify you when a match is found.");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">


        <div className="lg:col-span-3">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Register: {course.name}</h2>
              <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-blue-600 hover:underline">
                &larr; Back to details
              </button>
            </div>


            <div className="flex flex-col md:flex-row gap-3 mb-6">
              <select
                className="border border-gray-300 p-2 rounded-lg bg-white text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="All">All Roles</option>
                <option value="Lecturer">Lecturer</option>
                <option value="Senior Student">Senior Student</option>
              </select>
              <input
                placeholder="Search tutor by name..."
                className="border border-gray-300 p-2 rounded-lg flex-1 outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTutor}
                onChange={(e) => setSearchTutor(e.target.value)}
              />
              <button className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition font-medium">
                Filter
              </button>
            </div>


            <div className="space-y-4">
              {filteredClasses.map((cls) => {
                const isFull = cls.enrolled >= cls.max;
                return (
                  <div key={cls.id} className="border border-blue-100 rounded-lg overflow-hidden flex flex-col md:flex-row bg-white hover:shadow-md transition">

                    <div className="bg-blue-900 text-white p-6 w-full md:w-48 flex flex-col justify-center items-center text-center">
                      <p className="font-bold text-lg">{cls.id}</p>
                      <p className="text-sm font-medium mt-1">{cls.time}</p>
                    </div>


                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Tutor</p>
                          <h4 className="font-bold text-lg text-gray-800">{cls.tutor}</h4>
                          <span className={`inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full ${cls.role === 'Lecturer' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                            }`}>
                            {cls.role}
                          </span>
                        </div>


                        <div className="text-right">
                          <div className={`text-sm font-bold mb-2 ${isFull ? 'text-red-600' : 'text-blue-600'}`}>
                            {cls.enrolled}/{cls.max} Slots
                          </div>
                          <button
                            disabled={isFull}
                            onClick={() => handleRegister(cls)}
                            className={`px-5 py-2 rounded-lg text-sm font-bold transition shadow-sm ${isFull
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                          >
                            {isFull ? 'Full' : 'Select Class'}
                          </button>
                        </div>
                      </div>


                      <div className="flex items-center mt-4 pt-4 border-t border-gray-50">
                        <div className="flex items-center text-yellow-500 text-sm font-medium">
                          <span className="text-lg mr-1">★</span> {cls.rating}
                          <span className="text-gray-400 font-normal ml-1">({cls.reviewCount} reviews)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredClasses.length === 0 && (
                <div className="text-center py-8 text-gray-500">No classes found matching your filter.</div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div
            onClick={() => setShowAutoMatch(true)}
            className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-xl shadow-sm border border-blue-100 cursor-pointer hover:shadow-md transition group sticky top-6"
          >
            <div className="flex items-start gap-4">
              <div className="bg-blue-900 p-3 rounded-lg text-white group-hover:scale-110 transition-transform">

                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-blue-900 text-lg leading-tight mb-1">Tutor Auto-Matching</h3>
                <p className="text-xs text-gray-500 leading-relaxed">Let us find the best tutor that fits your learning style & schedule.</p>
              </div>
            </div>
            <div className="mt-4 text-right text-blue-600 text-sm font-semibold group-hover:translate-x-1 transition-transform">
              Start Now &rarr;
            </div>
          </div>
        </div>

      </div>

      {showAutoMatch && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-2xl transform scale-100 transition-all">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center border-b pb-4">Tutor Auto Matching Form</h2>
            <form onSubmit={handleAutoMatchSubmit} className="space-y-5">


              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Course</label>
                <input
                  type="text"
                  value={course.name}
                  disabled
                  className="w-full border border-gray-200 p-2.5 rounded-lg bg-gray-100 text-gray-500 font-medium"
                />
              </div>


              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Tutor Role</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-blue-900 rounded border-gray-300 focus:ring-blue-900" />
                    <span className="text-sm text-gray-700">Senior Student</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-blue-900 rounded border-gray-300 focus:ring-blue-900" />
                    <span className="text-sm text-gray-700">Lecturer</span>
                  </label>
                </div>
              </div>


              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Teaching Styles</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50 border border-transparent hover:border-gray-200 transition">
                    <input type="radio" name="style" className="text-blue-900 focus:ring-blue-900" />
                    <span className="text-sm text-gray-700">Facilitator - Focus on learner independence</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50 border border-transparent hover:border-gray-200 transition">
                    <input type="radio" name="style" className="text-blue-900 focus:ring-blue-900" />
                    <span className="text-sm text-gray-700">Demonstrator - Showing how it's done</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50 border border-transparent hover:border-gray-200 transition">
                    <input type="radio" name="style" className="text-blue-900 focus:ring-blue-900" />
                    <span className="text-sm text-gray-700">Delegator - Encouraging peer learning</span>
                  </label>
                </div>
              </div>


              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Preferred Time Slots</label>
                <select className="w-full border border-gray-300 p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                  <option>Anytime</option>
                  <option>Mon 08:00 - 10:00</option>
                  <option>Wed 13:00 - 15:00</option>
                  <option>Fri 08:00 - 11:00</option>
                </select>
              </div>

              <div className="mt-8 flex gap-4 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAutoMatch(false)}
                  className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-900 text-white rounded-lg hover:bg-blue-800 font-semibold shadow-lg shadow-blue-900/30 transition transform active:scale-95"
                >
                  Find Tutor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Registration;