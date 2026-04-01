import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileEdit,
  Calendar,
  Clock,
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import Navbar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { API_BASE } from "../../utils/constants";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import PageTransition from "../../components/ui/PageTransition";

export default function AdminUpdateExam() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Helper to format Date for input type="datetime-local"
  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    // Adjust for local timezone offset
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().slice(0, 16);
  };

  useEffect(() => {
    fetchExam();
  }, [id]);

  const fetchExam = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/api/exams/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTitle(res.data.title);
      setStartTime(formatDateTimeLocal(res.data.startTime));
      setEndTime(formatDateTimeLocal(res.data.endTime));
    } catch (err) {
      setError("Failed to load assessment details.");
    } finally {
      setLoading(false);
    }
  };

  const updateExam = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE}/api/exams/${id}`,
        {
          title,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setSuccess(true);
      setTimeout(() => navigate("/admin/manage-exams"), 1500);
    } catch (err) {
      setError("Update failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium">
          Retrieving assessment data...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
        <PageTransition>
          <div className="mb-8">
            <button
              onClick={() => navigate("/admin/manage-exams")}
              className="flex items-center gap-2 text-sm font-bold text-blue-600 mb-4 hover:gap-3 transition-all"
            >
              <ArrowLeft size={16} />
              BACK TO ASSESSMENTS
            </button>
            <h1 className="text-3xl font-bold text-slate-900">
              Update Assessment
            </h1>
            <p className="text-slate-500 mt-1">
              Modify title and schedule for the selected exam.
            </p>
          </div>

          <Card
            variant="plain"
            className="border-slate-200 shadow-xl shadow-slate-200/50"
          >
            <form onSubmit={updateExam} className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                    <FileEdit size={16} className="text-blue-500" />
                    Assessment Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-lg font-semibold"
                    placeholder="Exam Title"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                      <Calendar size={16} className="text-blue-500" />
                      Start Time
                    </label>
                    <input
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                      <Clock size={16} className="text-rose-500" />
                      End Time
                    </label>
                    <input
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
                  <ShieldCheck
                    className="text-blue-600 shrink-0 mt-0.5"
                    size={20}
                  />
                  <p className="text-xs text-blue-700 leading-relaxed font-medium">
                    Changes will take effect immediately. Students currently
                    taking the exam might be affected by schedule changes.
                  </p>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold"
                >
                  <AlertCircle size={16} />
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold"
                >
                  <CheckCircle2 size={16} />
                  Assessment updated successfully! Redirecting...
                </motion.div>
              )}

              <div className="pt-6 border-t border-slate-100 flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20"
                  disabled={submitting || success}
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                  {!submitting && !success && <Save size={18} />}
                  {success && <CheckCircle2 size={18} />}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate("/admin/manage-exams")}
                  disabled={submitting || success}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
}
