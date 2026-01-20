import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";

const API_BASE = "https://online-assessment-platform-backend-1.onrender.com";

export default function AdminManageExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_BASE}/api/exams`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(res.data)) {
        setExams(res.data);
      } else {
        setExams([]);
      }
    } catch (err) {
      console.error("Fetch exams failed", err);
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteExam = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${API_BASE}/api/exams/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchExams();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // ✅ UPDATED STATUS LOGIC (ACTIVE / UPCOMING / INACTIVE)
  const getExamStatus = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) return "UPCOMING";
    if (now >= start && now <= end) return "ACTIVE";
    return "EXPIRED";
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";
      case "UPCOMING":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-red-100 text-red-700";
    }
  };

  if (loading) return <p className="p-6">Loading exams...</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <AdminHeader />

      <h2 className="text-2xl font-bold my-4">Manage Exams</h2>

      {exams.length === 0 ? (
        <p>No exams found</p>
      ) : (
        <div className="space-y-4">
          {exams.map((exam) => {
            const status = getExamStatus(exam.startTime, exam.endTime);

            return (
              <div
                key={exam._id}
                className="bg-white p-4 rounded shadow flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">{exam.title}</h3>

                  <p className="text-sm text-gray-600">
                    {new Date(exam.startTime).toLocaleString()} –{" "}
                    {new Date(exam.endTime).toLocaleString()}
                  </p>

                  {/* ✅ STATUS BADGE */}
                  <span
                    className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyles(
                      status
                    )}`}
                  >
                    {status}
                  </span>
                </div>

                <div className="flex gap-2">
                  {/* UPDATE */}
                  <button
                    onClick={() => navigate(`/admin/update-exam/${exam._id}`)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    ✏️ Update
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => deleteExam(exam._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
