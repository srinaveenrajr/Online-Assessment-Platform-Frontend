import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Timer,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertTriangle,
  Maximize2,
  Video,
  CheckCircle2,
  HelpCircle,
  Flag,
  Loader2,
} from "lucide-react";
import { API_BASE } from "../utils/constants";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

export default function ExamPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [exam, setExam] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [markedForReview, setMarkedForReview] = useState({});
  const [attemptStatus, setAttemptStatus] = useState(null);
  const [examStartTime, setExamStartTime] = useState(null);

  const token = localStorage.getItem("token");

  const logViolation = useCallback(
    async (type, message) => {
      try {
        await axios.post(
          `${API_BASE}/api/proctor/log`,
          { examId: id, type, message },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      } catch {
        console.error("Proctor log failed");
      }
    },
    [id, token],
  );

  const stopWebcam = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const startWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      alert("Webcam permission is mandatory for this assessment.");
      logViolation("WEBCAM_BLOCKED", "Webcam permission denied");
    }
  }, [logViolation]);

  // Prevention of accidental exit
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const checkAttempt = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/api/results/check-attempt/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (res.data.attempted) {
          setAttemptStatus("ALREADY_ATTEMPTED");
          // STOP WEBCAM IMMEDIATELY ON REDIRECT
          stopWebcam();
        }
      } catch (err) {
        console.error("Failed to check attempt status");
      }
    };
    checkAttempt();
  }, [id, token, stopWebcam]);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/exams/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExam(res.data);

        // Calculate remaining time
        const end = new Date(res.data.endTime).getTime();
        const now = new Date().getTime();
        setTimeLeft(Math.max(0, Math.floor((end - now) / 1000)));
        setExamStartTime(new Date());

        startWebcam();
        document.documentElement.requestFullscreen().catch(() => {});
      } catch (err) {
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchExam();

    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        logViolation("FULLSCREEN_EXIT", "User exited fullscreen mode");
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        logViolation("TAB_SWITCH", "User switched tabs/windows");
      }
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      stopWebcam();
    };
  }, [id, token, navigate, startWebcam, stopWebcam, logViolation]);

  // Timer logic
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.onbeforeunload = null; // Important before auto-submit
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ":" : ""}${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleOptionSelect = (questionId, optionIndex) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const toggleMarkForReview = (questionId) => {
    setMarkedForReview((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const clearAnswer = (questionId) => {
    const newAnswers = { ...answers };
    delete newAnswers[questionId];
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await axios.post(
        `${API_BASE}/api/results/submit`,
        { examId: id, answers, startTime: examStartTime },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      stopWebcam();
      if (document.fullscreenElement) document.exitFullscreen();
      // Remove beforeunload listener before navigating
      window.onbeforeunload = null;
      navigate(`/result/${id}`);
    } catch (err) {
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="text-slate-400 font-medium animate-pulse">
          Initializing Secure Environment...
        </p>
      </div>
    );

  if (attemptStatus === "ALREADY_ATTEMPTED")
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle size={40} />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Assessment Already Attempted
        </h1>
        <p className="text-slate-400 max-w-md mb-8">
          Our records show you have already submitted this assessment. Per
          platform rules, only one attempt is allowed per student.
        </p>
        <Button onClick={() => navigate("/dashboard")}>
          Return to Dashboard
        </Button>
      </div>
    );

  const currentQuestion = exam.questions[currentQuestionIndex];
  const totalQuestions = exam.questions.length;
  const progress = (Object.keys(answers).length / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl flex items-center justify-between px-6 z-20 sticky top-0">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <h1 className="text-sm font-bold truncate max-w-[200px] md:max-w-md">
              {exam.title}
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
              In Progress • Secure Mode
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div
            className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-colors ${
              timeLeft < 300
                ? "bg-red-500/10 border-red-500/50 text-red-400 animate-pulse"
                : "bg-slate-800/50 border-slate-700 text-slate-300"
            }`}
          >
            <Timer size={18} />
            <span className="font-mono text-lg font-bold tabular-nums">
              {formatTime(timeLeft)}
            </span>
          </div>

          <Button
            variant="primary"
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20"
            onClick={() => setShowSubmitConfirm(true)}
          >
            Finish Exam
            <Send size={16} />
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Question Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-12">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Progress: {Math.round(progress)}%</span>
                <span>
                  {Object.keys(answers).length} of {totalQuestions} Answered
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-blue-500"
                />
              </div>
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <Badge
                    variant="glass"
                    className="bg-blue-500/10 text-blue-400 border-blue-500/20"
                  >
                    Question {currentQuestionIndex + 1}
                  </Badge>
                  <h2 className="text-2xl font-bold leading-relaxed text-slate-100">
                    {currentQuestion.questionText}
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {currentQuestion.options.map((option, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() =>
                        handleOptionSelect(currentQuestion._id, idx)
                      }
                      className={`flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-300 ${
                        answers[currentQuestion._id] === idx
                          ? "bg-blue-600/20 border-blue-500 text-blue-100 shadow-lg shadow-blue-500/10"
                          : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-800/50"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border-2 transition-colors ${
                          answers[currentQuestion._id] === idx
                            ? "bg-blue-500 border-blue-400 text-white"
                            : "bg-slate-800 border-slate-700 text-slate-500"
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="text-lg font-medium">{option}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-12 border-t border-slate-800">
              <Button
                variant="ghost"
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                className="text-slate-400 hover:text-white"
              >
                <ChevronLeft size={20} />
                Previous
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => toggleMarkForReview(currentQuestion._id)}
                  className={`transition-colors ${markedForReview[currentQuestion._id] ? "text-amber-500 bg-amber-500/10" : "text-slate-400"}`}
                >
                  <Flag size={18} />
                  {markedForReview[currentQuestion._id]
                    ? "Marked for Review"
                    : "Mark for Review"}
                </Button>

                {answers[currentQuestion._id] !== undefined && (
                  <Button
                    variant="ghost"
                    onClick={() => clearAnswer(currentQuestion._id)}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    Clear Answer
                  </Button>
                )}
              </div>

              <Button
                variant="primary"
                disabled={currentQuestionIndex === totalQuestions - 1}
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                className="bg-blue-600 hover:bg-blue-500"
              >
                Next Question
                <ChevronRight size={20} />
              </Button>
            </div>
          </div>
        </main>

        {/* Right Sidebar: Proctoring & Navigation */}
        <aside
          className={`w-80 border-l border-slate-800 bg-slate-900/30 backdrop-blur-md flex flex-col transition-all duration-300 ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          {/* Proctoring Feed */}
          <div className="p-4 border-b border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <Video size={14} className="text-red-500 animate-pulse" />
                Live Proctoring
              </div>
              <Badge
                variant="glass"
                className="bg-red-500/10 text-red-500 border-red-500/20 text-[10px]"
              >
                REC
              </Badge>
            </div>
            <div className="relative aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover grayscale brightness-75 contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
              <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></div>
                <span className="text-[10px] font-mono text-white/70">
                  PROCTOR_012 // ACTIVE
                </span>
              </div>
            </div>
          </div>

          {/* Question Grid Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
              Question Map
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {exam.questions.map((q, idx) => (
                <button
                  key={q._id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-200 relative ${
                    currentQuestionIndex === idx
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/50"
                      : answers[q._id] !== undefined
                        ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30"
                        : "bg-slate-800 text-slate-500 border border-slate-700 hover:border-slate-500"
                  }`}
                >
                  {idx + 1}
                  {markedForReview[q._id] && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-slate-900"></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-t border-slate-800 space-y-3">
            <button
              onClick={() => document.documentElement.requestFullscreen()}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-400 text-xs font-bold transition-colors"
            >
              <span>Toggle Fullscreen</span>
              <Maximize2 size={14} />
            </button>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
              <AlertTriangle
                size={16}
                className="text-amber-500 shrink-0 mt-0.5"
              />
              <p className="text-[10px] text-amber-500/80 leading-relaxed font-medium">
                Multiple tab switches or exiting fullscreen will be flagged to
                the proctor.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Submit Confirmation Modal */}
      <AnimatePresence>
        {showSubmitConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSubmitConfirm(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl"
            >
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6 mx-auto">
                <HelpCircle size={32} />
              </div>
              <h2 className="text-2xl font-bold text-center mb-2">
                Ready to finish?
              </h2>
              <p className="text-slate-400 text-center mb-8">
                You have answered {Object.keys(answers).length} out of{" "}
                {totalQuestions} questions. You cannot change your answers after
                submission.
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/10"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Yes, Submit My Exam"
                  )}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowSubmitConfirm(false)}
                  className="w-full py-4 text-slate-400 hover:text-white"
                >
                  No, Continue Working
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
