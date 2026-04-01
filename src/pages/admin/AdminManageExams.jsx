import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  Clock,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ChevronRight,
  FileText,
} from "lucide-react";
import Navbar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { API_BASE } from "../../utils/constants";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import PageTransition from "../../components/ui/PageTransition";

export default function AdminManageExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/api/exams`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExams(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch exams failed", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteExam = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this assessment? This action cannot be undone.",
      )
    )
      return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/api/exams/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchExams();
    } catch (err) {
      alert("Delete failed. Please try again.");
    }
  };

  const getExamStatus = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (now < start) return "UPCOMING";
    if (now >= start && now <= end) return "ACTIVE";
    return "EXPIRED";
  };

  const filteredExams = exams.filter((exam) =>
    exam.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <PageTransition>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Manage Assessments
              </h1>
              <p className="text-slate-500 mt-1">
                Create, edit and monitor all examinations
              </p>
            </div>

            <Button
              onClick={() => navigate("/admin/exam")}
              className="shadow-blue-500/20"
            >
              <Plus size={20} />
              Create New Exam
            </Button>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by exam title..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" className="px-4">
                <Filter size={20} />
                Filters
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 rounded-2xl shimmer"></div>
              ))}
            </div>
          ) : filteredExams.length === 0 ? (
            <Card
              variant="plain"
              className="text-center py-20 border-dashed border-2 border-slate-200 bg-transparent"
            >
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <AlertCircle size={40} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                No assessments found
              </h3>
              <p className="text-slate-500 max-w-xs mx-auto mt-2">
                Try adjusting your search or create a new assessment.
              </p>
            </Card>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                        Assessment Details
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                        Status
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                        Schedule
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <AnimatePresence>
                      {filteredExams.map((exam) => {
                        const status = getExamStatus(
                          exam.startTime,
                          exam.endTime,
                        );
                        return (
                          <motion.tr
                            key={exam._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="hover:bg-slate-50/50 transition-colors group"
                          >
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-4">
                                <div
                                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-colors ${
                                    status === "ACTIVE"
                                      ? "bg-blue-50 text-blue-600"
                                      : "bg-slate-100 text-slate-500"
                                  }`}
                                >
                                  <FileText size={24} />
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                    {exam.title}
                                  </p>
                                  <p className="text-xs text-slate-500 mt-0.5">
                                    {exam.questions?.length || 0} Questions
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <Badge
                                variant={
                                  status === "ACTIVE"
                                    ? "success"
                                    : status === "UPCOMING"
                                      ? "warning"
                                      : "danger"
                                }
                              >
                                {status}
                              </Badge>
                            </td>
                            <td className="px-6 py-5">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                  <Calendar
                                    size={14}
                                    className="text-slate-400"
                                  />
                                  {new Date(
                                    exam.startTime,
                                  ).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                  <Clock size={14} />
                                  {new Date(exam.startTime).toLocaleTimeString(
                                    [],
                                    { hour: "2-digit", minute: "2-digit" },
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() =>
                                    navigate(`/admin/update-exam/${exam._id}`)
                                  }
                                  className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                  title="Edit"
                                >
                                  <Edit2 size={18} />
                                </button>
                                <button
                                  onClick={() => deleteExam(exam._id)}
                                  className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                                  title="Delete"
                                >
                                  <Trash2 size={18} />
                                </button>
                                <button
                                  className="p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all"
                                  title="View More"
                                >
                                  <ChevronRight size={18} />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
}
