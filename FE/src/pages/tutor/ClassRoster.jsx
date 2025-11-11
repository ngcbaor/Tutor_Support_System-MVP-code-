import { Link, useParams } from 'react-router-dom'
import { mockClasses, mockStudents } from '../../data/mockClasses'

function ClassRoster() {
  const { classId } = useParams()
  const classInfo = mockClasses.find(c => c.id === classId)

  if (!classInfo) {
    return <div className="text-center py-12">Class not found</div>
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'recent':
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
            Oct 24, 2025
          </span>
        )
      case 'none':
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">
            Needs Review
          </span>
        )
      case 'old':
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
            Oct 15, 2025
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Class Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
          {classInfo.name}
        </h1>
        <p className="text-gray-600">
          {classInfo.courseId} - {classInfo.group} • Enrollment: {classInfo.enrollment}
        </p>
      </div>

      {/* Students List */}
      <div className="space-y-4">
        {mockStudents.map((student) => (
          <Link
            key={student.id}
            to={`/tutor/class/${classId}/student/${student.id}`}
            className="
              flex items-center justify-between bg-white rounded-xl shadow-sm 
              p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200
              border border-white hover:border-blue-600
            "
          >
            {/* Left: Avatar + Info */}
            <div className="flex items-center gap-5 flex-1 min-w-0">
              <div className={`
                w-12 h-12 rounded-full text-white font-semibold text-lg
                flex items-center justify-center shrink-0
                ${student.avatarColor}
              `}>
                {student.avatar}
              </div>
              
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {student.name}
                </h3>
                <p className="text-sm text-gray-600 truncate">
                  ID: {student.id} • {student.email}
                </p>
              </div>
            </div>

            {/* Right: Status + Arrow */}
            <div className="flex items-center gap-6 shrink-0 ml-4">
              {getStatusBadge(student.status)}
              
              <svg 
                className="w-6 h-6 text-gray-300 group-hover:text-blue-600 transition-colors"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default ClassRoster
