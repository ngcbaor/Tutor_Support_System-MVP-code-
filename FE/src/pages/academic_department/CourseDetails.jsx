import { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { mockCourseDetails } from '../../data/mockReports';

export default function CourseDetails() {
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();

  const term = searchParams.get('term') || 'sem1-2025';
  const faculty = searchParams.get('faculty') || 'cs';
  const program = searchParams.get('program') || 'cq';

  const [courseData, setCourseData] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState(new Set());

  useEffect(() => {
    // Load course data
    const data = mockCourseDetails[courseId];
    if (data) {
      setCourseData(data);
    }
  }, [courseId]);

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    if (checked) {
      setSelectedStudents(new Set(courseData.students.map(s => s.id)));
    } else {
      setSelectedStudents(new Set());
    }
  };

  const handleSelectStudent = (studentId) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
    setSelectAll(newSelected.size === courseData.students.length);
  };

  const handleNotifyTutor = () => {
    const count = selectedStudents.size;
    alert(`Simulating notification for tutor(s) of ${count} selected student(s)...`);
  };

  const handleExportList = () => {
    const count = selectedStudents.size;
    alert(`Simulating export for ${count} selected student(s)...`);
  };

  if (!courseData) {
    return (
      <div className="min-h-screen bg-white">
        <div className="text-center py-12">
          <p className="text-gray-600">Course not found.</p>
          <Link
            to={`/academic-department/monitor-performance/dashboard?term=${term}&faculty=${faculty}&program=${program}`}
            className="text-blue-600 hover:text-blue-700 font-medium mt-4 inline-block"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Course: {courseData.name} ({courseData.code})
        </h1>
        <p className="text-sm text-gray-600">
          Review student performance and manage at-risk notifications.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="flex items-start gap-4 bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="text-3xl shrink-0 mt-1">📊</div>
          <div className="flex flex-col">
            <div className="text-sm font-medium text-gray-500 mb-1.5">Avg. Grade</div>
            <div className="flex items-baseline gap-1">
              <span className={`text-3xl font-bold leading-tight ${
                courseData.avgGrade < 7 ? 'text-amber-600' : 'text-gray-900'
              }`}>
                {courseData.avgGrade}
              </span>
              <span className="text-base font-medium text-gray-500">/ 10.0</span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4 bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="text-3xl shrink-0 mt-1">📉</div>
          <div className="flex flex-col">
            <div className="text-sm font-medium text-gray-500 mb-1.5">Failure Rate</div>
            <div className="flex items-baseline gap-1">
              <span className={`text-3xl font-bold leading-tight ${
                courseData.failureRate > 15 ? 'text-red-600' : 'text-gray-900'
              }`}>
                {courseData.failureRate}
              </span>
              <span className="text-base font-medium text-gray-500">%</span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4 bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="text-3xl shrink-0 mt-1">🙋</div>
          <div className="flex flex-col">
            <div className="text-sm font-medium text-gray-500 mb-1.5">Participation</div>
            <div className="flex items-baseline gap-1">
              <span className={`text-3xl font-bold leading-tight ${
                courseData.participation < 80 ? 'text-amber-600' : 'text-gray-900'
              }`}>
                {courseData.participation}
              </span>
              <span className="text-base font-medium text-gray-500">%</span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4 bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="text-3xl shrink-0 mt-1">🧑‍🏫</div>
          <div className="flex flex-col">
            <div className="text-sm font-medium text-gray-500 mb-1.5">At-Risk Students</div>
            <div className="flex items-baseline gap-1">
              <span className={`text-3xl font-bold leading-tight ${
                courseData.atRiskCount > 10 ? 'text-red-600' : 'text-gray-900'
              }`}>
                {courseData.atRiskCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="select-all-checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className="w-4 h-4 rounded border-gray-300"
            />
            <label htmlFor="select-all-checkbox" className="text-sm font-medium text-gray-900 cursor-pointer">
              Select All
            </label>
            {selectedStudents.size > 0 && (
              <span className="text-sm font-medium text-gray-500">
                ({selectedStudents.size} selected)
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleNotifyTutor}
              disabled={selectedStudents.size === 0}
              className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md border transition-colors ${
                selectedStudents.size === 0
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <i className="fas fa-chalkboard-teacher"></i> Notify Tutor(s)
            </button>
            <button
              onClick={handleExportList}
              disabled={selectedStudents.size === 0}
              className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                selectedStudents.size === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <i className="fas fa-file-excel"></i> Export List
            </button>
          </div>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left"></th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Reason(s) for Flag
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Current Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tutor / Advisor
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courseData.students.map((student) => (
                <tr
                  key={student.id}
                  className={`${
                    student.isAtRisk ? 'bg-amber-50 hover:bg-amber-100' : 'hover:bg-gray-50'
                  } ${selectedStudents.has(student.id) ? 'bg-blue-50 hover:bg-blue-100' : ''} transition-colors`}
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedStudents.has(student.id)}
                      onChange={() => handleSelectStudent(student.id)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{student.name}</div>
                    <small className="text-xs text-gray-500">ID: {student.id}</small>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide border ${
                      student.status === 'high'
                        ? 'bg-red-50 text-red-700 border-red-400'
                        : student.status === 'medium'
                        ? 'bg-amber-50 text-amber-700 border-amber-400'
                        : 'bg-green-50 text-green-700 border-green-400'
                    }`}>
                      {student.statusLabel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {student.reason}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {student.grade}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {student.tutor} / {student.advisor}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors" title="View Details">
                      <i className="fas fa-eye text-base"></i>
                    </a>
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
