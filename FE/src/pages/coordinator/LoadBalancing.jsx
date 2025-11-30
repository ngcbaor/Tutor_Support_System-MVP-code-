import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockCoordinatorClasses } from '../../data/mockCoordinator';

const ProgressBar = ({ current, max, status }) => {
  const percent = (current / max) * 100;
  let colorClass = "bg-blue-600";
  if (status === "Underloaded") colorClass = "bg-red-500";
  if (percent >= 100) colorClass = "bg-green-500";
  if (status === "Balanced") colorClass = "bg-green-500";

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
      <div className={`h-2.5 rounded-full ${colorClass}`} style={{ width: `${percent}%` }}></div>
    </div>
  );
};

function LoadBalancing() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    setCourses([...mockCoordinatorClasses]);
  }, []);

  const alertCount = courses.reduce((acc, course) =>
    acc + course.classes.filter(c => c.status === "Underloaded").length, 0
  );

  const handleFinalize = () => {
    if (confirm("Are you sure you want to finalize the registration period? This will lock all class assignments.")) {
      alert("Registration finalized successfully! Notifications have been sent to students and tutors.");

      navigate('/coordinator/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">

        <div className="lg:col-span-3 space-y-6">
          <h1 className="text-2xl font-bold text-blue-900">Registration Management</h1>

          {courses.map((course) => (
            <div key={course.id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">{course.name} ({course.id})</h2>

              <div className="space-y-4">
                {course.classes.map((cls) => (
                  <div key={cls.id} className="flex flex-col md:flex-row justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition">
                    <div className="flex-1 w-full md:w-auto">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${cls.status === 'Underloaded' ? 'bg-red-500' : 'bg-green-500'
                          }`}></span>
                        <h3 className="font-bold text-blue-900">{cls.schedule}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Tutor: <strong>{cls.tutor}</strong> ({cls.role})</p>

                      <div className="w-full max-w-xs">
                        <ProgressBar current={cls.enrolled} max={cls.max} status={cls.status} />
                        <p className={`text-xs mt-1 font-semibold ${cls.status === 'Underloaded' ? 'text-red-600' : 'text-gray-500'
                          }`}>
                          {cls.enrolled}/{cls.max} Students
                          {cls.status === 'Underloaded' && ' (Low Enrollment)'}
                          {cls.status === 'Balanced' && ' (Balanced)'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0">
                      <button
                        onClick={() => navigate(`/coordinator/class-adjustment/${course.id}/${cls.id}`)}
                        className={`px-6 py-2 rounded-lg text-white text-sm font-bold shadow-sm transition ${cls.status === 'Underloaded'
                          ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                          : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                      >
                        {cls.status === 'Underloaded' ? 'Modify' : 'View'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          {alertCount > 0 ? (
            <div className="bg-white border border-red-100 rounded-lg p-0 shadow-sm sticky top-6 overflow-hidden">
              <div className="bg-red-500 p-4 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="text-white">
                  <h3 className="font-bold text-lg">Action Required</h3>
                  <p className="text-xs text-red-100">{alertCount} classes require load balancing</p>
                </div>
              </div>

              <div className="p-4">
                <p className="text-sm text-gray-600">
                  Some classes have low enrollment numbers. Please move students to other classes to optimize resources.
                </p>

              </div>
            </div>
          ) : (
            <div className="bg-white border border-green-100 rounded-lg p-0 shadow-sm sticky top-6 overflow-hidden animate-in fade-in">
              <div className="bg-green-500 p-4 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div className="text-white">
                  <h3 className="font-bold text-lg">All Clear</h3>
                  <p className="text-xs text-green-100">All courses are balanced.</p>
                </div>
              </div>

              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">
                  Great job! No underloaded classes detected. You can now finalize the registration process.
                </p>

                <button
                  onClick={handleFinalize}
                  className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold text-sm shadow-sm transition flex items-center justify-center gap-2"
                >
                  Confirm Finalization
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default LoadBalancing;