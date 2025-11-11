import { Link } from 'react-router-dom'
import { mockClasses } from '../../data/mockClasses'

function TutorClass() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">My Classes</h1>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockClasses.map((classItem) => (
          <Link
            key={classItem.id}
            to={`/tutor/class/${classItem.id}`}
            className={`
              block bg-white rounded-xl shadow-sm hover:shadow-md 
              transition-all duration-200 overflow-hidden
              border-t-4 hover:-translate-y-1
              ${classItem.color === 'blue' ? 'border-blue-600' : ''}
              ${classItem.color === 'green' ? 'border-green-600' : ''}
              ${classItem.color === 'orange' ? 'border-orange-600' : ''}
            `}
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {classItem.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4 font-medium">
                {classItem.courseId} - {classItem.group}
              </p>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-200 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Enrollment:</span>{' '}
                  <strong className="text-gray-900">{classItem.enrollment}</strong>
                </div>
                <div>
                  <span className="font-medium">Time:</span>{' '}
                  <strong className="text-gray-900">{classItem.time}</strong>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default TutorClass
