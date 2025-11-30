import { useEffect } from 'react'

function Toast({ message, type = 'error', onClose }) {
  useEffect(() => {
    const t = setTimeout(() => onClose(), 4000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div className={`px-4 py-3 rounded-md shadow-md text-sm font-medium flex items-center gap-2 ${
      type === 'error' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
    }`}>
      {type === 'error' && <span>⚠️</span>}
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-auto text-xs opacity-75 hover:opacity-100"
        aria-label="Close"
      >×</button>
    </div>
  )
}

export default Toast
