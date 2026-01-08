import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";

export default function Dashboard() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/exams`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setExams(res.data);
      } catch (err) {
        alert("Failed to load exams");
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const now = new Date();

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h2>Dashboard</h2>

        {exams.length === 0 && <p>No exams available</p>}

        {exams.map((exam) => {
          const isActive =
            now >= new Date(exam.startTime) && now <= new Date(exam.endTime);

          return (
            <div
              key={exam._id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "6px",
              }}
            >
              <h3>{exam.title}</h3>

              <p>
                Status:{" "}
                <b style={{ color: isActive ? "green" : "red" }}>
                  {isActive ? "Active" : "Not Active"}
                </b>
              </p>

              <button
                disabled={!isActive}
                onClick={() => navigate(`/exam/${exam._id}`)}
                style={{
                  backgroundColor: isActive ? "#007bff" : "#ccc",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  cursor: isActive ? "pointer" : "not-allowed",
                }}
              >
                Start Exam
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
