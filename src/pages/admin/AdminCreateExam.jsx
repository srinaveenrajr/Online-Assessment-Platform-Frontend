import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminCreateExam() {
  const [title, setTitle] = useState("");
  const [banks, setBanks] = useState([]);
  const [bankId, setBankId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    axios
      .get(
        "https://online-assessment-platform-backend-1.onrender.com/api/question-banks"
      )
      .then((res) => setBanks(res.data));
  }, []);

  const createExam = async () => {
    try {
      await axios.post(
        "https://online-assessment-platform-backend-1.onrender.com/api/exams",
        {
          title,
          questionBank: bankId,
          startTime,
          endTime,
          duration,
          totalMarks: 0,
        }
      );
      alert("Exam created");
      setTitle("");
      setBankId("");
      setStartTime("");
      setEndTime("");
      setDuration("");
    } catch {
      alert("Failed to create exam");
    }
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Create Exam</h1>

      <input
        placeholder="Exam Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-full mb-2"
      />

      <select
        value={bankId}
        onChange={(e) => setBankId(e.target.value)}
        className="border p-2 w-full mb-2"
      >
        <option value="">Select Question Bank</option>
        {banks.map((b) => (
          <option key={b._id} value={b._id}>
            {b.name}
          </option>
        ))}
      </select>

      <input
        type="datetime-local"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        className="border p-2 w-full mb-2"
      />

      <input
        type="datetime-local"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        className="border p-2 w-full mb-2"
      />

      <input
        placeholder="Duration (minutes)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <button
        onClick={createExam}
        className="bg-purple-600 text-white px-4 py-2 rounded"
      >
        Create Exam
      </button>
    </div>
  );
}
