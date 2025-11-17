import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./pages/LoginPage.jsx"
import RegisterPage from "./pages/RegisterPage.jsx"
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx"
import AdminDashboard from "./pages/AdminDashboard.jsx"
import AlumniDashboard from "./pages/AlumniDashboard.jsx"
import SchoolDashboard from "./pages/SchoolDashboard.jsx"
import CreateSurveyPage from "./pages/CreateSurveyPage.jsx"
import EditSurveyPage from "./pages/EditSurveyPage.jsx"
import SurveyAnalyticsPage from "./pages/SurveyAnalyticsPage.jsx"
import TakeSurveyPage from "./pages/TakeSurveyPage.jsx"
import Unauthorized from "./pages/Unauthorized.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import Layout from "./components/Layout.jsx"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route element={<Layout />}>
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alumni"
            element={
              <ProtectedRoute roles={["ALUMNI"]}>
                <AlumniDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school"
            element={
              <ProtectedRoute roles={["SCHOOL"]}>
                <SchoolDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/surveys/create"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <CreateSurveyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/surveys/:surveyId/analytics"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <SurveyAnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/surveys/:id/edit"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <EditSurveyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alumni/surveys/:surveyId"
            element={
              <ProtectedRoute roles={["ALUMNI"]}>
                <TakeSurveyPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
