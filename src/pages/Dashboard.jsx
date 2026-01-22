import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import { API_BASE } from "../utils/constants";

export default function Dashboard() {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_BASE}/api/exams`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const validExams = Array.isArray(res.data)
          ? res.data.filter(
              (exam) => exam && exam._id && exam.startTime && exam.endTime,
            )
          : [];

        setExams(validExams);
      } catch (err) {
        console.error("Failed to load exams", err);
      }
    };

    fetchExams();
  }, []);

  const getExamStatus = (exam) => {
    const now = new Date();
    const start = new Date(exam.startTime);
    const end = new Date(exam.endTime);

    if (now < start) return "UPCOMING";
    if (now > end) return "EXPIRED";
    return "ACTIVE";
  };

  const startExam = (examId) => {
    navigate(`/exam/${examId}`);
  };

  const viewResult = (examId) => {
    navigate(`/result/${examId}`);
  };

  return (
    <>
      <Navbar />

      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>

        {exams.length === 0 && <p>No exams available</p>}

        {exams.map((exam) => {
          const status = getExamStatus(exam);
          const isActive = status === "ACTIVE";

          return (
            <div
              key={exam._id}
              className="border p-4 rounded mb-4 flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold text-lg">{exam.title}</h2>

                <p>Start: {new Date(exam.startTime).toLocaleString("en-IN")}</p>

                <p>End: {new Date(exam.endTime).toLocaleString("en-IN")}</p>

                <span
                  className={`inline-block mt-2 px-3 py-1 text-sm rounded ${
                    status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : status === "UPCOMING"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {status}
                </span>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3">
                <button
                  disabled={!isActive}
                  onClick={() => startExam(exam._id)}
                  className={`px-4 py-2 rounded text-white ${
                    isActive
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Start Test
                </button>

                <button
                  onClick={() => viewResult(exam._id)}
                  className="px-4 py-2 rounded text-white bg-purple-600 hover:bg-purple-700"
                >
                  Result
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
