import { useNavigate } from 'react-router-dom'
import { completedCourses, recentSessions, hasFeedback } from '../../data/mockFeedback'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

function Feedback() {
  const navigate = useNavigate()

  const handleAction = (id) => {
    navigate(`/student/feedback/${id}`)
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-gray-900">Feedback</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completed Courses */}
        <Card className="p-6 flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-gray-800">Completed Courses</h3>
          <div className="flex flex-col gap-4">
            {completedCourses.map(course => {
              const feedbackGiven = hasFeedback(course.id)
              return (
                <div key={course.id} className="rounded-lg overflow-hidden border border-gray-200">
                  <div className="bg-blue-900 text-white p-4 flex flex-col gap-1">
                    <div className="text-xs tracking-wide font-medium">{course.code}</div>
                    <div className="font-semibold">{course.name}</div>
                    <div className="text-xs">Tutor <span className="font-medium">{course.tutor}</span></div>
                    <div className="text-xs flex items-center gap-1 mt-1">
                      <span>★ {course.avgRating} ({course.reviewsCount} reviews)</span>
                    </div>
                  </div>
                  <div className="bg-white p-4 flex justify-end">
                    <Button
                      variant="primary"
                      onClick={() => handleAction(course.id)}
                    >
                      {feedbackGiven ? 'View Feedback' : 'Feedback'}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Recent Sessions */}
        <Card className="p-6 flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-gray-800">Recent Sessions</h3>
          <div className="flex flex-col gap-4">
            {recentSessions.map((sess, sIndex) => {
              const feedbackGiven = hasFeedback(sess.id)
              const colors = ['bg-purple-100','bg-indigo-100','bg-green-100','bg-yellow-100']
              const colorCls = colors[sIndex % colors.length]
              // time formatting (24h to 12h with AM/PM)
              const [hStr, mStr] = sess.startTime.split(':')
              const hour24 = parseInt(hStr, 10)
              const period = hour24 >= 12 ? 'PM' : 'AM'
              const hour12 = ((hour24 + 11) % 12) + 1
              const formattedTime = `${hour12}:${mStr} ${period}`
              return (
                <div key={sess.id} className={`rounded-lg overflow-hidden border border-gray-200 ${colorCls}`}>
                  <div className="p-4 flex flex-col gap-1">
                    <div className="text-xs font-medium tracking-wide">{sess.courseCode}</div>
                    <div className="font-semibold">{sess.title}</div>
                    <div className="text-xs text-gray-700">{new Date(sess.date).toLocaleDateString('en-GB')} - {formattedTime}</div>
                  </div>
                  <div className="bg-white p-4 flex justify-end">
                    <Button
                      variant="primary"
                      onClick={() => handleAction(sess.id)}
                    >
                      {feedbackGiven ? 'View Feedback' : 'Feedback'}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Feedback
