import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function ExamPage() {
  const { id } = useParams(); // examId
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  /* ===============================
     🔒 BLOCK ADMIN COMPLETELY
  =============================== */
  if (!user) {
    return (
      <div className="p-6 text-red-600 font-bold">
        Please login to continue.
      </div>
    );
  }

  if (user.role === "admin") {
    return (
      <div className="p-6 text-red-600 font-bold">
        ❌ Admins are not allowed to take exams.
      </div>
    );
  }

  /* ===============================
     STATE
  =============================== */
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ===============================
     FETCH EXAM
  =============================== */
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await axios.get(
          `https://online-assessment-platform-backend-1.onrender.com/api/exams/${id}/start`
        );

        // 🔒 Safety checks
        if (
          !res.data ||
          !res.data.questionBank ||
          !res.data.questionBank.questions ||
          res.data.questionBank.questions.length === 0
        ) {
          setError("This exam has no questions assigned.");
          setLoading(false);
          return;
        }

        setExam(res.data);
        setLoading(false);
      } catch (err) {
        setError("Exam not available or not active.");
        setLoading(false);
      }
    };

    fetchExam();
  }, [id]);

  /* ===============================
     TAB SWITCH DETECTION
  =============================== */
  useEffect(() => {
    if (!exam) return;

    const handleVisibilityChange = async () => {
      if (document.hidden) {
        alert("⚠️ Tab switch detected!");

        await axios.post(
          "https://online-assessment-platform-backend-1.onrender.com/api/proctor/log",
          {
            studentId: user._id,
            examId: exam._id,
            type: "TAB_SWITCH",
            message: "Student switched tab",
          }
        );
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [exam, user]);

  /* ===============================
     FULLSCREEN ENFORCEMENT
  =============================== */
  useEffect(() => {
    if (!exam) return;

    const requestFullscreen = async () => {
      try {
        await document.documentElement.requestFullscreen();
      } catch {}
    };

    requestFullscreen();

    const handleExitFullscreen = async () => {
      if (!document.fullscreenElement) {
        alert("⚠️ Fullscreen exit detected!");

        await axios.post(
          "https://online-assessment-platform-backend-1.onrender.com/api/proctor/log",
          {
            studentId: user._id,
            examId: exam._id,
            type: "FULLSCREEN_EXIT",
            message: "Student exited fullscreen",
          }
        );
      }
    };

    document.addEventListener("fullscreenchange", handleExitFullscreen);

    return () =>
      document.removeEventListener("fullscreenchange", handleExitFullscreen);
  }, [exam, user]);

  /* ===============================
     CAMERA CHECK
  =============================== */
  useEffect(() => {
    if (!exam) return;

    navigator.mediaDevices.getUserMedia({ video: true }).catch(async () => {
      alert("⚠️ Camera access denied!");

      await axios.post(
        "https://online-assessment-platform-backend-1.onrender.com/api/proctor/log",
        {
          studentId: user._id,
          examId: exam._id,
          type: "CAMERA_DENIED",
          message: "Camera permission denied",
        }
      );
    });
  }, [exam, user]);

  /* ===============================
     HANDLE ANSWERS
  =============================== */
  const handleAnswerChange = (questionId, selectedAnswer) => {
    setAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === questionId);

      if (existing) {
        return prev.map((a) =>
          a.questionId === questionId ? { ...a, selectedAnswer } : a
        );
      }

      return [...prev, { questionId, selectedAnswer }];
    });
  };

  /* ===============================
     SUBMIT EXAM
  =============================== */
  const submitExam = async () => {
    try {
      await axios.post(
        "https://online-assessment-platform-backend-1.onrender.com/api/results/submit",
        {
          examId: exam._id,
          studentId: user._id,
          answers,
        }
      );

      alert("✅ Exam submitted successfully");
      navigate("/dashboard");
    } catch {
      alert("❌ Failed to submit exam");
    }
  };

  /* ===============================
     UI STATES
  =============================== */
  if (loading) {
    return <div className="p-6">Loading exam...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600 font-bold">{error}</div>;
  }

  /* ===============================
     MAIN UI
  =============================== */
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{exam.title}</h1>

      {exam.questionBank.questions.map((q, index) => (
        <div key={q._id} className="border p-4 mb-4 rounded">
          <p className="font-semibold mb-2">
            {index + 1}. {q.questionText}
          </p>

          {q.options.map((opt, i) => (
            <label key={i} className="block">
              <input
                type="radio"
                name={q._id}
                onChange={() => handleAnswerChange(q._id, opt)}
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </div>
      ))}

      <button
        onClick={submitExam}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Submit Exam
      </button>
    </div>
  );
}
