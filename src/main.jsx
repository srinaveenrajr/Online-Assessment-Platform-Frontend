import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ExamPage from "./pages/ExamPage";
import ResultPage from "./pages/ResultPage";
import ResultsPage from "./pages/ResultsPage";
import ProfilePage from "./pages/ProfilePage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotificationsPage from "./pages/NotificationsPage";

// ✅ ADMIN PAGES
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCreateQuestion from "./pages/admin/AdminCreateQuestion";
import AdminCreateQuestionBank from "./pages/admin/AdminCreateQuestionBank";
import AdminCreateExam from "./pages/admin/AdminCreateExam";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminProctorLogs from "./pages/admin/AdminProctorLogs";
import AdminManageExams from "./pages/admin/AdminManageExams";
import AdminUpdateExam from "./pages/admin/AdminUpdateExam";

import AdminRoute from "./components/AdminRoute";
import StudentRoute from "./components/StudentRoute";
import ProtectedRoute from "./components/ProtectedRoute";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* AUTH */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* STUDENT (PROTECTED) */}
          <Route
            path="/dashboard"
            element={
              <StudentRoute>
                <Dashboard />
              </StudentRoute>
            }
          />
          <Route
            path="/exam/:id"
            element={
              <StudentRoute>
                <ExamPage />
              </StudentRoute>
            }
          />
          <Route
            path="/result/:id"
            element={
              <StudentRoute>
                <ResultPage />
              </StudentRoute>
            }
          />
          <Route
            path="/results"
            element={
              <StudentRoute>
                <ResultsPage />
              </StudentRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />

          {/* ADMIN (PROTECTED) */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/question"
            element={
              <AdminRoute>
                <AdminCreateQuestion />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/question-bank"
            element={
              <AdminRoute>
                <AdminCreateQuestionBank />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/exam"
            element={
              <AdminRoute>
                <AdminCreateExam />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <AdminRoute>
                <AdminAnalytics />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/proctor-logs"
            element={
              <AdminRoute>
                <AdminProctorLogs />
              </AdminRoute>
            }
          />

          {/* ✅ FIXED: ADMIN MANAGE EXAMS (PROTECTED) */}
          <Route
            path="/admin/manage-exams"
            element={
              <AdminRoute>
                <AdminManageExams />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/update-exam/:id"
            element={
              <AdminRoute>
                <AdminUpdateExam />
              </AdminRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
