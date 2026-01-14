import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function ExamPage() {
  const { id } = useParams();

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  /* ===========================
     PROCTOR LOG
  =========================== */
  const logViolation = async (type, message) => {
    try {
      await axios.post(
        "http://localhost:5000/api/proctor/log",
        { examId: id, type, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch {
      console.error("Proctor log failed");
    }
  };

  /* ===========================
     START WEBCAM
  =========================== */
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
    } catch {
      alert("Webcam permission is mandatory");
      logViolation("WEBCAM_BLOCKED", "Webcam permission denied");
    }
  };

  /* ===========================
     STOP WEBCAM
  =========================== */
  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
  };

  /* ===========================
     LOAD EXAM
  =========================== */
  useEffect(() => {
    if (!id) {
      window.location.replace("/dashboard");
      return;
    }

    const fetchExam = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/exams/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setExam(res.data);
        document.documentElement.requestFullscreen().catch(() => {});
        startWebcam();
      } catch {
        window.location.replace("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchExam();

    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        logViolation("FULLSCREEN_EXIT", "Exited fullscreen");
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        logViolation("TAB_SWITCH", "Tab switched");
      }
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      stopWebcam();
      document.exitFullscreen().catch(() => {});
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [id]);

  /* ===========================
     ANSWERS
  =========================== */
  const handleChange = (qid, option) => {
    setAnswers((prev) => ({ ...prev, [qid]: option }));
  };

  /* ===========================
     SUBMIT EXAM
  =========================== */
  const handleSubmit = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/results/submit",
        { examId: exam._id, answers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      stopWebcam();
      document.exitFullscreen().catch(() => {});
      window.location.replace("/dashboard");
    } catch {
      alert("Submit failed");
    }
  };

  if (loading) return <p className="p-4">Loading exam...</p>;
  if (!exam) return null;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{exam.title}</h1>

      <video ref={videoRef} autoPlay muted className="w-40 h-32 border mb-4" />

      {exam.questions.map((q, index) => (
        <div key={q._id} className="mb-6 border p-4 rounded">
          <p className="font-semibold">
            {index + 1}. {q.questionText}
          </p>

          {/* 🔥 FIX IS HERE */}
          {q.options
            .filter((opt) => opt && opt.trim() !== "")
            .map((opt, i) => (
              <label key={i} className="block mt-2">
                <input
                  type="radio"
                  name={q._id}
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
