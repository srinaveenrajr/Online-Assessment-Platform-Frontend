import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";

const API_BASE = "https://online-assessment-platform-backend-1.onrender.com";

export default function AdminUpdateExam() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExam();
  }, []);

  const fetchExam = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_BASE}/api/exams/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTitle(res.data.title);
      setStartTime(res.data.startTime.slice(0, 16));
      setEndTime(res.data.endTime.slice(0, 16));
    } catch (err) {
      alert("Failed to load exam");
    } finally {
      setLoading(false);
    }
  };

  const updateExam = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_BASE}/api/exams/${id}`,
        { title, startTime, endTime },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Exam updated successfully");
      navigate("/admin/manage-exams");
    } catch (err) {
      alert("Update failed");
    }
  };

  if (loading) return <p className="p-6">Loading exam...</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <AdminHeader />

      <h2 className="text-2xl font-bold my-4">Update Exam</h2>

      <form
        onSubmit={updateExam}
        className="bg-white p-6 rounded shadow max-w-md"
      >
        <label className="block mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 mb-4"
          required
        />

        <label className="block mb-2">Start Time</label>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-full border p-2 mb-4"
          required
        />

        <label className="block mb-2">End Time</label>
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="w-full border p-2 mb-4"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          💾 Save Changes
        </button>
      </form>
    </div>
  );
}
