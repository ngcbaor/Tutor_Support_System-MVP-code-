import { useState } from 'react'

function StarRating({ label, value, onChange, required = false, error = false, disabled = false }) {
  const [hover, setHover] = useState(0)
  const displayValue = hover || value

  const containerClasses = `rounded-md border ${error ? 'bg-red-500/80 border-red-600' : 'bg-gray-100 border-gray-200'} px-4 py-4 flex flex-col items-center gap-3 transition-colors text-center`

  return (
    <div className={containerClasses}>
      <div className="flex items-center gap-2">
        <p className={`text-sm font-medium ${error ? 'text-white' : 'text-gray-700'}`}>
          {label}{required && <span className="text-red-500"> *</span>}
        </p>
        {required && error && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-600 text-white">Required</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {[1,2,3,4,5].map(star => {
          const filled = star <= displayValue
          return (
            <button
              key={star}
              type="button"
              disabled={disabled}
              onMouseEnter={() => !disabled && setHover(star)}
              onMouseLeave={() => !disabled && setHover(0)}
              onClick={() => !disabled && onChange(star)}
              className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${disabled ? 'cursor-default' : 'cursor-pointer'} ${filled ? 'text-yellow-500' : error ? 'text-white' : 'text-gray-300'} hover:scale-105`}
              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            >
              <span className="text-xl select-none">★</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default StarRating
