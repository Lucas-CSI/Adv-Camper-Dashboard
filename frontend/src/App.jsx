import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/layout/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ModulesPage from "./pages/ModulesPage";
import ModuleDetailPage from "./pages/ModuleDetailPage";
import LessonPage from "./pages/LessonPage";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ModuleFormPage from "./pages/admin/ModuleFormPage";
import LessonFormPage from "./pages/admin/LessonFormPage";
import QuestionsManagerPage from "./pages/admin/QuestionsManagerPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/modules" element={<ModulesPage />} />
          <Route path="/modules/:id" element={<ModuleDetailPage />} />

          {/* Student — requires auth */}
          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />
          <Route path="/lessons/:id" element={
            <ProtectedRoute><LessonPage /></ProtectedRoute>
          } />

          {/* Admin — requires ROLE_ADMIN */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/modules/new" element={
            <ProtectedRoute adminOnly><ModuleFormPage /></ProtectedRoute>
          } />
          <Route path="/admin/modules/:id/edit" element={
            <ProtectedRoute adminOnly><ModuleFormPage /></ProtectedRoute>
          } />
          <Route path="/admin/modules/:moduleId/lessons/new" element={
            <ProtectedRoute adminOnly><LessonFormPage /></ProtectedRoute>
          } />
          <Route path="/admin/lessons/:lessonId/edit" element={
            <ProtectedRoute adminOnly><LessonFormPage /></ProtectedRoute>
          } />
          <Route path="/admin/lessons/:lessonId/questions" element={
            <ProtectedRoute adminOnly><QuestionsManagerPage /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}