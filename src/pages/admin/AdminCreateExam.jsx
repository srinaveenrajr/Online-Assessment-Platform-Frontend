import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Calendar,
  Clock,
  Library,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Settings,
  ShieldCheck,
} from "lucide-react";
import Navbar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { API_BASE } from "../../utils/constants";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import PageTransition from "../../components/ui/PageTransition";

export default function AdminCreateExam() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [questionBanks, setQuestionBanks] = useState([]);
  const [questionBankId, setQuestionBankId] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingBanks, setFetchingBanks] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBanks = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/question-banks`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setQuestionBanks(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setFetchingBanks(false);
      }
    };
    loadBanks();
  }, []);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      await axios.post(
        `${API_BASE}/api/exams`,
        {
          title,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
          questionBankId,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      setStep(4); // Success step
      setTimeout(() => navigate("/admin/manage-exams"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create exam. Please check all fields.",
      );
      setStep(3); // Go back to review if failed
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !title) return setError("Exam title is required");
    if (step === 2 && (!startTime || !endTime))
      return setError("Both start and end times are required");
    if (step === 3 && !questionBankId)
      return setError("Please select a question bank");
    setError("");
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setError("");
    setStep((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <PageTransition>
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-slate-900">
              Create New Assessment
            </h1>
            <p className="text-slate-500 mt-2">
              Configure your exam rules, schedule, and questions.
            </p>
          </div>

          {/* Stepper */}
          <div className="mb-12 relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
            <div className="relative z-10 flex justify-between">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                      step >= s
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                        : "bg-white border-2 border-slate-200 text-slate-400"
                    }`}
                  >
                    {step > s ? <CheckCircle2 size={20} /> : s}
                  </div>
                  <span
                    className={`text-xs font-bold mt-2 uppercase tracking-widest ${step >= s ? "text-blue-600" : "text-slate-400"}`}
                  >
                    {s === 1 ? "Basics" : s === 2 ? "Schedule" : "Questions"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Card
            variant="plain"
            className="border-slate-200 shadow-xl shadow-slate-200/50 min-h-[400px] flex flex-col"
          >
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8 flex-1"
                >
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100 text-blue-700">
                      <Settings size={24} />
                      <p className="text-sm font-medium">
                        Start by giving your assessment a clear and professional
                        title.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">
                        Assessment Title
                      </label>
                      <input
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-lg font-semibold"
                        placeholder="e.g. Advanced React Architecture Quiz"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8 flex-1"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                        <Calendar size={16} className="text-blue-500" />
                        Start Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                        <Clock size={16} className="text-rose-500" />
                        End Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
                    <ShieldCheck
                      className="text-amber-600 shrink-0 mt-0.5"
                      size={20}
                    />
                    <p className="text-xs text-amber-700 leading-relaxed font-medium">
                      Make sure the duration provides enough time for students
                      to complete all questions. Proctored exams automatically
                      close after the end time.
                    </p>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8 flex-1"
                >
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                      <Library size={16} className="text-purple-500" />
                      Select Question Bank
                    </label>

                    {fetchingBanks ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="h-24 rounded-2xl shimmer"
                          ></div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {questionBanks.map((bank) => (
                          <button
                            key={bank._id}
                            onClick={() => setQuestionBankId(bank._id)}
                            className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
                              questionBankId === bank._id
                                ? "bg-blue-50 border-blue-500 shadow-lg shadow-blue-500/10"
                                : "bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4
                                className={`font-bold ${questionBankId === bank._id ? "text-blue-700" : "text-slate-900"}`}
                              >
                                {bank.name}
                              </h4>
                              {questionBankId === bank._id && (
                                <CheckCircle2
                                  className="text-blue-600"
                                  size={20}
                                />
                              )}
                            </div>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">
                              {bank.questions?.length || 0} Questions
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-1 flex flex-col items-center justify-center text-center space-y-4"
                >
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={48} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Exam Created!
                  </h2>
                  <p className="text-slate-500 max-w-xs">
                    The assessment has been successfully scheduled and
                    published.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            {step < 4 && (
              <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
                <Button
                  variant="ghost"
                  disabled={step === 1}
                  onClick={prevStep}
                  className="text-slate-400 hover:text-slate-900"
                >
                  <ArrowLeft size={18} />
                  Back
                </Button>

                {step < 3 ? (
                  <Button onClick={nextStep} className="px-8">
                    Next Step
                    <ArrowRight size={18} />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-emerald-600 hover:bg-emerald-500 px-8 shadow-emerald-500/20"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Publish Assessment"
                    )}
                    {!loading && <CheckCircle2 size={18} />}
                  </Button>
                )}
              </div>
            )}
          </Card>
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
}
