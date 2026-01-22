import React from "react";
import { Link } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <br />

      <div className="grid grid-rows-2 grid-cols-3 gap-4 text-center p-20 lg:text-[25px] ">
        <Link
          to="/admin/question"
          className="block  row-span-1 bg-blue-600 hover:bg-blue-700 shadow text-white p-4 rounded lg:h-[300px] lg:flex lg:justify-center lg:items-center"
        >
          ➕ Manage Questions
        </Link>

        <Link
          to="/admin/question-bank"
          className="block   row-span-1 bg-green-600 hover:bg-green-700 shadow  text-white p-4 rounded lg:h-[300px] lg:flex lg:justify-center items-center"
        >
          📚 Create Question Bank
        </Link>

        <Link
          to="/admin/exam"
          className="block bg-purple-600 hover:bg-purple-700 shadow text-white p-4 rounded lg:h-[300px] lg:flex lg:justify-center items-center"
        >
          📝 Create Exam
        </Link>

        {/* ✅ NEW FEATURE */}
        <Link
          to="/admin/manage-exams"
          className="block bg-indigo-600 hover:bg-indigo-700 shadow text-white p-4 rounded lg:h-[300px] lg:flex lg:justify-center items-center"
        >
          🗂️ Manage Exams
        </Link>

        <Link
          to="/admin/analytics"
          className="block bg-pink-800 hover:bg-pink-900 shadow text-white p-4 rounded lg:h-[300px] lg:flex lg:justify-center items-center"
        >
          📊 View Analytics
        </Link>

        <Link
          to="/admin/proctor-logs"
          className="block bg-red-600 hover:bg-red-700  shadow text-white p-4 rounded lg:h-[300px] lg:flex lg:justify-center items-center"
        >
          🚨 Proctoring Logs
        </Link>
      </div>
    </div>
  );
}
