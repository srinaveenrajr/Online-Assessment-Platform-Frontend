import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ExamPage from "./pages/ExamPage";
import ResultPage from "./pages/ResultPage";

// ✅ ADMIN PAGES
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCreateQuestion from "./pages/admin/AdminCreateQuestion";
import AdminCreateQuestionBank from "./pages/admin/AdminCreateQuestionBank";
import AdminCreateExam from "./pages/admin/AdminCreateExam";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminProctorLogs from "./pages/admin/AdminProctorLogs";
import AdminRoute from "./components/AdminRoute";
import StudentRoute from "./components/StudentRoute";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* AUTH */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
