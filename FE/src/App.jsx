import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

// Public pages
import Landing from './pages/public/Landing'
import Login from './pages/public/Login'
import AuthCallback from './pages/public/AuthCallback'

// Student pages
import StudentDashboard from './pages/student/Dashboard'
import StudentTimetable from './pages/student/Timetable'
import CourseList from './pages/student/CourseList'
import StudentResources from './pages/resources/StudentResources'

// Tutor pages
import TutorDashboard from './pages/tutor/Dashboard'
import SessionManagement from './pages/tutor/SessionManagement'
import CourseReport from './pages/tutor/CourseReport'
import TutorClass from './pages/tutor/Class'
import ClassRoster from './pages/tutor/ClassRoster'
import StudentProfile from './pages/tutor/StudentProfile'
import TutorResources from './pages/resources/TutorResources'
import HcmutLibSearch from './pages/resources/hcmut_lib_search'

// Coordinator pages
import CoordinatorDashboard from './pages/coordinator/Dashboard'
import LoadBalancing from './pages/coordinator/LoadBalancing'

// Academic Affairs pages
import AcademicAffairsDashboard from './pages/academic_affairs/Dashboard'
import GenerateOverviewReport from './pages/academic_affairs/GenerateOverviewReport'
import AcademicAffairsReportList from './pages/academic_affairs/ReportList'

// Student Affairs pages
import StudentAffairsDashboard from './pages/student_affairs/Dashboard'
import StudentAffairsReportList from './pages/student_affairs/ReportList'

// Academic Department pages
import MonitorStudentPerformance from './pages/academic_department/MonitorStudentPerformance'
import PerformanceDashboard from './pages/academic_department/PerformanceDashboard'
import CourseDetails from './pages/academic_department/CourseDetails'

// Shared pages
import Profile from './pages/shared/Profile'
import Library from './pages/shared/Library'
import ReportViewAllocation from './pages/shared/ReportViewAllocation'
import ReportViewAwarding from './pages/shared/ReportViewAwarding'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Student routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute requiredRole="student">
                <Layout>
                  <StudentDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/timetable"
            element={
              <ProtectedRoute requiredRole="student">
                <Layout>
                  <StudentTimetable />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/courses"
            element={
              <ProtectedRoute requiredRole="student">
                <Layout>
                  <CourseList />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/resources"
            element={
              <ProtectedRoute requiredRole="student">
                <Layout>
                  <Library />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute requiredRole="student">
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/resources"
            element={
              <ProtectedRoute requiredRole="student">
                <Layout>
                  <StudentResources />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Tutor routes */}
          <Route
            path="/tutor/dashboard"
            element={
              <ProtectedRoute requiredRole="tutor">
                <Layout>
                  <TutorDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tutor/sessions"
            element={
              <ProtectedRoute requiredRole="tutor">
                <Layout>
                  <SessionManagement />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tutor/reports"
            element={
              <ProtectedRoute requiredRole="tutor">
                <Layout>
                  <CourseReport />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tutor/class"
            element={
              <ProtectedRoute requiredRole="tutor">
                <Layout>
                  <TutorClass />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tutor/class/:classId"
            element={
              <ProtectedRoute requiredRole="tutor">
                <Layout>
                  <ClassRoster />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tutor/class/:classId/student/:studentId"
            element={
              <ProtectedRoute requiredRole="tutor">
                <Layout>
                  <StudentProfile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tutor/profile"
            element={
              <ProtectedRoute requiredRole="tutor">
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/tutor/resources"
            element={
              <ProtectedRoute requiredRole="tutor">
                <Layout>
                  <TutorResources />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tutor/resources/hcmut-library"
            element={
              <ProtectedRoute requiredRole="tutor">
                <Layout>
                  <HcmutLibSearch />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Coordinator routes */}
          <Route
            path="/coordinator/dashboard"
            element={
              <ProtectedRoute requiredRole="coordinator">
                <Layout>
                  <CoordinatorDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/coordinator/load-balancing"
            element={
              <ProtectedRoute requiredRole="coordinator">
                <Layout>
                  <LoadBalancing />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/coordinator/profile"
            element={
              <ProtectedRoute requiredRole="coordinator">
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Academic Affairs routes */}
          <Route
            path="/academic-affairs/dashboard"
            element={
              <ProtectedRoute requiredRole="academic_affairs">
                <Layout>
                  <AcademicAffairsDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/academic-affairs/profile"
            element={
              <ProtectedRoute requiredRole="academic_affairs">
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/academic-affairs/generate-overview-report"
            element={
              <ProtectedRoute requiredRole="academic_affairs">
                <Layout>
                  <GenerateOverviewReport />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/academic-affairs/report-list"
            element={
              <ProtectedRoute requiredRole="academic_affairs">
                <Layout>
                  <AcademicAffairsReportList />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Student Affairs routes */}
          <Route
            path="/student-affairs/dashboard"
            element={
              <ProtectedRoute requiredRole="student_affairs">
                <Layout>
                  <StudentAffairsDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-affairs/report-list"
            element={
              <ProtectedRoute requiredRole="student_affairs">
                <Layout>
                  <StudentAffairsReportList />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-affairs/profile"
            element={
              <ProtectedRoute requiredRole="student_affairs">
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Academic Department routes */}
          <Route
            path="/academic-department/monitor-performance"
            element={
              <ProtectedRoute requiredRole="academic_department">
                <Layout>
                  <MonitorStudentPerformance />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/academic-department/profile"
            element={
              <ProtectedRoute requiredRole="academic_department">
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/academic-department/monitor-performance/dashboard"
            element={
              <ProtectedRoute requiredRole="academic_department">
                <Layout>
                  <PerformanceDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/academic-department/monitor-performance/course/:courseId"
            element={
              <ProtectedRoute requiredRole="academic_department">
                <Layout>
                  <CourseDetails />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Shared routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/report/allocation/:reportId"
            element={
              <ProtectedRoute>
                <Layout>
                  <ReportViewAllocation />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/report/awarding/:reportId"
            element={
              <ProtectedRoute>
                <Layout>
                  <ReportViewAwarding />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
