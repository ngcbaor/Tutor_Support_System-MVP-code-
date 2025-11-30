import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getItemById, getFeedbackById, saveFeedback } from '../../data/mockFeedback'
import StarRating from '../../components/feedback/StarRating'
import Button from '../../components/ui/Button'
import Toast from '../../components/ui/Toast'
import Card from '../../components/ui/Card'

function FeedbackDetail() {
  const { itemId } = useParams()
  const item = getItemById(itemId)
  const existing = getFeedbackById(itemId)

  const [ratings, setRatings] = useState({
    sessionContent: existing?.sessionContent || 0,
    teacherQuality: existing?.teacherQuality || 0,
    overall: existing?.overall || 0
  })
  const [comment, setComment] = useState(existing?.comment || '')
  const [submitted, setSubmitted] = useState(!!existing)
  const [errors, setErrors] = useState({})
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    // reset errors when ratings change
    if (Object.keys(errors).length) {
      setErrors(prev => ({ ...prev, sessionContent: false, teacherQuality: false, overall: false }))
    }
  }, [ratings.sessionContent, ratings.teacherQuality, ratings.overall])

  if (!item) {
    return <div className="text-red-600">Item not found.</div>
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (submitted) return

    const newErrors = {
      sessionContent: ratings.sessionContent === 0,
      teacherQuality: ratings.teacherQuality === 0,
      overall: ratings.overall === 0
    }

    const charLimit = 1000
    const hasCharOverflow = comment.length > charLimit
    if (hasCharOverflow) {
      setToasts(prev => [...prev, { id: Date.now(), message: `Comment exceeds ${charLimit} character limit`, type: 'error' }])
    }

    if (Object.values(newErrors).some(Boolean) || hasCharOverflow) {
      setErrors(newErrors)
      return
    }

    // Save
    const saved = saveFeedback(itemId, { ...ratings, comment })
    setSubmitted(true)
  }

  const charCount = comment.length
  const charLimit = 1000

  return (
    <div className="relative">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(t => (
          <Toast
            key={t.id}
            message={t.message}
            type={t.type}
            onClose={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
          />
        ))}
      </div>

      <h2 className="text-2xl font-semibold mb-6 text-gray-900">Feedback</h2>
      <Card className="p-6 max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold text-center mb-6 text-gray-800">
          {submitted ? 'Your Feedback' : 'What do you think about this session?'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <StarRating
            label="Session Content"
            value={ratings.sessionContent}
            onChange={(v) => setRatings(r => ({ ...r, sessionContent: v }))}
            required
            error={errors.sessionContent}
            disabled={submitted}
          />
          <StarRating
            label="Teacher Quality"
            value={ratings.teacherQuality}
            onChange={(v) => setRatings(r => ({ ...r, teacherQuality: v }))}
            required
            error={errors.teacherQuality}
            disabled={submitted}
          />
          <StarRating
            label="Overall"
            value={ratings.overall}
            onChange={(v) => setRatings(r => ({ ...r, overall: v }))}
            required
            error={errors.overall}
            disabled={submitted}
          />

            <div className={`rounded-md border ${errors.commentLength ? 'border-red-600' : 'border-gray-200'} bg-gray-100 p-4`}>            
            <label className="text-sm font-medium text-gray-700 mb-2 block" htmlFor="comment">Comment (Optional)</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={submitted}
              className="w-full h-32 resize-none rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              placeholder="Your comment here"
            />
            <div className={`flex justify-end text-xs mt-1 ${charCount > charLimit ? 'text-red-600 font-medium' : 'text-gray-500'}`}>{charCount}/{charLimit} characters</div>
          </div>

          {!submitted && (
            <Button type="submit" variant="primary" className="w-full">Submit</Button>
          )}
          {submitted && (
            <div className="text-center text-sm text-green-700 font-medium">Feedback submitted.</div>
          )}
        </form>
      </Card>
    </div>
  )
}

export default FeedbackDetail
