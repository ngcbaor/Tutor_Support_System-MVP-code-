import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Public pages
import Landing from './pages/public/Landing'
import AuthCallback from './pages/public/AuthCallback'

// Student pages
import StudentDashboard from './pages/student/Dashboard'

// Tutor pages
import TutorDashboard from './pages/tutor/Dashboard'

// Coordinator pages
import CoordinatorDashboard from './pages/coordinator/Dashboard'

// Academic pages
import AcademicDashboard from './pages/academic/Dashboard'

// Shared pages
import Profile from './pages/shared/Profile'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Student routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Tutor routes */}
          <Route
            path="/tutor/dashboard"
            element={
              <ProtectedRoute requiredRole="tutor">
                <TutorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Coordinator routes */}
          <Route
            path="/coordinator/dashboard"
            element={
              <ProtectedRoute requiredRole="coordinator">
                <CoordinatorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Academic routes */}
          <Route
            path="/academic/dashboard"
            element={
              <ProtectedRoute requiredRole="academic">
                <AcademicDashboard />
              </ProtectedRoute>
            }
          />

          {/* Shared routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
