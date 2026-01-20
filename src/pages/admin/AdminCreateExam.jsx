import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";

export default function AdminCreateExam() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [questionBanks, setQuestionBanks] = useState([]);
  const [questionBankId, setQuestionBankId] = useState("");
  const [error, setError] = useState("");

  /* ===========================
     LOAD QUESTION BANKS
  =========================== */
  useEffect(() => {
    const loadBanks = async () => {
      try {
        const res = await axios.get(
          "https://online-assessment-platform-backend-1.onrender.com/api/question-banks",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setQuestionBanks(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadBanks();
  }, []);

  /* ===========================
     CREATE EXAM
  =========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !startTime || !endTime || !questionBankId) {
      setError("All fields are required");
      return;
    }

    try {
      await axios.post(
        "https://online-assessment-platform-backend-1.onrender.com/api/exams",
        {
          title,
          startTime,
          endTime,
          questionBankId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Exam created successfully");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err.response?.data || err);
      setError(err.response?.data?.message || "Failed to create exam");
    }
  };

  /* ===========================
     UI
  =========================== */
  return (
    <div className="p-5">
      <AdminHeader />

      <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
        <br />

        <h2 className="text-2xl font-bold mb-4">Create Exam</h2>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            className="border p-2 w-full mb-3"
            placeholder="Exam Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="datetime-local"
            className="border p-2 w-full mb-3"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />

          <input
            type="datetime-local"
            className="border p-2 w-full mb-3"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />

          <select
            className="border p-2 w-full mb-4"
            value={questionBankId}
            onChange={(e) => setQuestionBankId(e.target.value)}
          >
            <option value="">Select Question Bank</option>
            {questionBanks.map((qb) => (
              <option key={qb._id} value={qb._id}>
                {qb.name}
              </option>
            ))}
          </select>

          <button className="bg-blue-600 text-white w-full py-2 rounded">
            Create Exam
          </button>
        </form>
      </div>
    </div>
  );
}
