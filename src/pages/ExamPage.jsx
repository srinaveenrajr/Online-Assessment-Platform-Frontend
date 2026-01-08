import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";

export default function ExamPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/exams/${id}/start`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setExam(res.data);
      } catch (err) {
        if (err.response?.status === 403) {
          alert("❌ This exam is not active yet or has expired.");
          navigate("/student-dashboard");
        } else if (err.response?.status === 401) {
          alert("Session expired. Please login again.");
          navigate("/login");
        } else {
          alert("Failed to load exam.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [id, navigate]);

  const handleChange = (questionId, selectedOption) => {
    setAnswers({ ...answers, [questionId]: selectedOption });
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/results/submit`,
        {
          examId: id,
          answers,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("✅ Exam submitted successfully!");
      navigate("/student-dashboard");
    } catch (err) {
      alert("❌ Failed to submit exam");
    }
  };

  if (loading) return <p>Loading exam...</p>;
  if (!exam) return null;

  return (
    <>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h2>{exam.title}</h2>

        {exam.questions.map((q, index) => (
          <div key={q._id} style={{ marginBottom: "20px" }}>
            <p>
              {index + 1}. {q.questionText}
            </p>

            {q.options.map((opt, i) => (
              <label key={i} style={{ display: "block" }}>
                <input
                  type="radio"
                  name={q._id}
                  value={opt}
                  checked={answers[q._id] === opt}
                  onChange={() => handleChange(q._id, opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        ))}

        <button onClick={handleSubmit}>Submit Exam</button>
      </div>
    </>
  );
}
