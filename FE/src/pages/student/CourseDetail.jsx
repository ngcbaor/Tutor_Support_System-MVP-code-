import { useParams, useNavigate } from 'react-router-dom';
import { mockCourses } from '../../data/mockCourses';
import { mockStudent } from '../../data/mockStudent';

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = mockCourses.find(c => c.id === id);

  if (!course) return <div className="p-10 text-center text-red-500">Course not found</div>;

  const missingPrerequisites = course.prerequisites.filter(
    prereq => !mockStudent.completedCourses.includes(prereq)
  );
  const isPrerequisiteMet = missingPrerequisites.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">

        {!isPrerequisiteMet && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 flex items-center shadow-sm">
            <div className="flex-shrink-0 mr-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-500 font-bold text-xl">!</span>
            </div>
            <div>
              <p className="font-bold text-red-700 text-lg">Prerequisite NOT Met</p>
              <p className="text-sm text-red-600 mt-1">
                You must complete the following courses first: <span className="font-semibold">{missingPrerequisites.join(', ')}</span>.
              </p>
            </div>
          </div>
        )}

        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <h1 className="text-2xl font-bold text-blue-900 mb-6 border-b pb-4">Course Description</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-gray-700 mb-6">
            <div><strong>Course Name:</strong> {course.name}</div>
            <div><strong>Course ID:</strong> {course.code}</div>
            <div><strong>Department:</strong> {course.department}</div>
            <div><strong>Credits:</strong> {course.credits}</div>

            <div className="col-span-1 md:col-span-2">
              <strong>Prerequisites:</strong>
              {course.prerequisites.length > 0 ? (
                <span className="ml-2 font-mono text-red-600 bg-red-50 px-2 py-1 rounded">
                  {course.prerequisites.join(', ')}
                </span>
              ) : (
                <span className="ml-2 text-gray-500 italic">None</span>
              )}
            </div>

            <div className="col-span-1 md:col-span-2">
              <strong>Tutors in-charge:</strong> {course.tutorsInCharge.join(', ')}
            </div>
          </div>

          <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
            <strong className="text-blue-900 block mb-2">Learning Outcomes:</strong>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed text-sm">
              {course.description}
            </p>
          </div>

          <div className="mt-8 flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
            >
              Back
            </button>
            <button
              disabled={!isPrerequisiteMet}
              onClick={() => navigate(`/student/registration/${course.id}`)}
              className={`px-6 py-2 rounded-lg text-white transition shadow-sm font-medium ${!isPrerequisiteMet
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              Select to Register
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetail;