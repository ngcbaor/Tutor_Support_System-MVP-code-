import { useNavigate } from 'react-router-dom';
import { mockCoordinatorClasses } from '../../data/mockCoordinator';

function CoordinatorDashboard() {
  const navigate = useNavigate();

  const totalCourses = mockCoordinatorClasses.length;
  const totalClasses = mockCoordinatorClasses.reduce((acc, c) => acc + c.classes.length, 0);

  const alertsCount = mockCoordinatorClasses.reduce((acc, course) =>
    acc + course.classes.filter(c => c.status === "Underloaded").length, 0
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Coordinator Dashboard</h1>
          <p className="text-gray-500 mt-2">Welcome back! Here is an overview of the registration period.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Courses</p>
              <p className="text-2xl font-bold text-gray-800">{totalCourses}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Active Classes</p>
              <p className="text-2xl font-bold text-gray-800">{totalClasses}</p>
            </div>
          </div>

          <div className={`p-6 rounded-xl shadow-sm border flex items-center gap-4 transition ${alertsCount > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
            }`}>
            <div className={`p-3 rounded-lg ${alertsCount > 0 ? 'bg-red-200 text-red-600' : 'bg-green-200 text-green-600'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className={`text-sm font-medium ${alertsCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                Registration Alerts
              </p>
              <p className={`text-2xl font-bold ${alertsCount > 0 ? 'text-red-700' : 'text-green-700'}`}>
                {alertsCount} Issues
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-4">Management Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div
            onClick={() => navigate('/coordinator/load-balancing')}
            className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              {alertsCount > 0 && (
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                  Action Required
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600">Registration & Load Balancing</h3>
            <p className="text-gray-500 text-sm">
              Monitor class enrollments, handle underloaded classes, and finalize registration periods.
            </p>
          </div>



        </div>
      </div>
    </div>
  );
}

export default CoordinatorDashboard;