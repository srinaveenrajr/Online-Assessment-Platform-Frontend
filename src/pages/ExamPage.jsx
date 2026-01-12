import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function ExamPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate("/dashboard");
      return;
    }

    const fetchExam = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`http://localhost:5000/api/exams/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setExam(res.data);
      } catch (err) {
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [id, navigate]);

  const handleChange = (questionId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/results/submit",
        {
          examId: exam._id, // ✅ FIXED
          answers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Exam submitted successfully");
      navigate("/dashboard");
    } catch (err) {
      alert("Failed to submit exam");
      console.error(err);
    }
  };

  if (loading) return <p className="p-4">Loading exam...</p>;

  if (!exam || !exam.questions || exam.questions.length === 0) {
    return <p className="p-4">No questions found for this exam</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{exam.title}</h1>

      {exam.questions.map((q, index) => (
        <div key={q._id} className="mb-6 border p-4 rounded">
          <p className="font-semibold mb-3">
            {index + 1}. {q.questionText}
          </p>

          {q.options.map((opt, i) => (
            <label key={i} className="block mt-2">
              <input
                type="radio"
                name={q._id}
                value={opt}
                onChange={() => handleChange(q._id, opt)}
              />
              <span className="ml-2">{opt}</span>
            </label>
          ))}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-6 py-2 rounded"
      >
        Submit Exam
      </button>
    </div>
  );
}
