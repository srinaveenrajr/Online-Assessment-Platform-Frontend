import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user.role === "admin") {
      navigate("/admin/dashboard");
      return;
    }

    axios
      .get(
        "https://online-assessment-platform-backend-1.onrender.com/api/exams"
      )
      .then((res) => setExams(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Available Exams</h1>

      {exams.length === 0 && <p>No exams available</p>}

      {exams.map((exam) => (
        <div key={exam._id} className="border p-4 mb-3 rounded">
          <h2 className="font-semibold">{exam.title}</h2>

          <button
            onClick={() => navigate(`/exam/${exam._id}`)}
            className="mt-2 bg-blue-600 text-white px-4 py-1 rounded"
          >
            Take Test
          </button>
        </div>
      ))}
    </div>
  );
}
