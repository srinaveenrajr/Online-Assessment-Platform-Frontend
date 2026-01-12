import React from "react";
import { Link } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <AdminHeader />
      <br />
      <div className="grid gap-4 max-w-md">
        <Link
          to="/admin/question"
          className="block bg-blue-600 text-white p-4 rounded"
        >
          ➕ Create Question
        </Link>

        <Link
          to="/admin/question-bank"
          className="block bg-green-600 text-white p-4 rounded"
        >
          📚 Create Question Bank
        </Link>

        <Link
          to="/admin/exam"
          className="block bg-purple-600 text-white p-4 rounded"
        >
          📝 Create Exam
        </Link>

        <Link
          to="/admin/analytics"
          className="block bg-gray-800 text-white p-4 rounded"
        >
          📊 View Analytics
        </Link>

        <Link
          to="/admin/proctor-logs"
          className="block bg-red-600 text-white p-4 rounded"
        >
          🚨 Proctoring Logs
        </Link>
      </div>
    </div>
  );
}
