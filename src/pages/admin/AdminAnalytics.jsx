import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Users,
  Trophy,
  Target,
  Download,
  Search,
  TrendingUp,
  ChevronRight,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import Navbar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { API_BASE } from "../../utils/constants";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import PageTransition from "../../components/ui/PageTransition";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
);

export default function AdminAnalytics() {
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingExams, setFetchingExams] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/exams`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setExams(res.data))
      .catch((err) => console.error("Failed to load exams", err))
      .finally(() => setFetchingExams(false));
  }, [token]);

  const loadAnalytics = (examId) => {
    if (!examId) return;
    setLoading(true);
    axios
      .get(`${API_BASE}/api/results/analytics/${examId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setResults(res.data))
      .catch((err) => console.error("Analytics fetch failed", err))
      .finally(() => setLoading(false));
  };

  const selectedExam = exams.find((e) => e._id === selectedExamId);

  // Stats calculation
  const totalStudents = results ? results.length : 0;
  const averageScore =
    totalStudents > 0
      ? (
          results.reduce((acc, curr) => acc + (curr.score || 0), 0) /
          totalStudents
        ).toFixed(1)
      : 0;
  const passCount = results
    ? results.filter((r) => (r.score || 0) >= (r.totalQuestions || 10) / 2)
        .length
    : 0;
  const passRate =
    totalStudents > 0 ? ((passCount / totalStudents) * 100).toFixed(0) : 0;

  const topScore =
    results && results.length > 0
      ? Math.max(...results.map((r) => r.score || 0))
      : 0;

  // Chart Data
  const scoreDistData = {
    labels: ["0-25%", "26-50%", "51-75%", "76-100%"],
    datasets: [
      {
        label: "Students",
        data: results
          ? [
              results.filter((r) => (r.accuracy || 0) <= 25).length,
              results.filter(
                (r) => (r.accuracy || 0) > 25 && (r.accuracy || 0) <= 50,
              ).length,
              results.filter(
                (r) => (r.accuracy || 0) > 50 && (r.accuracy || 0) <= 75,
              ).length,
              results.filter((r) => (r.accuracy || 0) > 75).length,
            ]
          : [0, 0, 0, 0],
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <PageTransition>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Exam Analytics
              </h1>
              <p className="text-slate-500 mt-1">
                Deep dive into student performance and assessment quality.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <BarChart3
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <select
                  value={selectedExamId}
                  onChange={(e) => {
                    setSelectedExamId(e.target.value);
                    loadAnalytics(e.target.value);
                  }}
                  className="pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all appearance-none cursor-pointer min-w-[240px]"
                >
                  <option value="">Select Assessment</option>
                  {exams.map((exam) => (
                    <option key={exam._id} value={exam._id}>
                      {exam.title}
                    </option>
                  ))}
                </select>
              </div>
              <Button variant="secondary" size="sm" disabled={!selectedExamId}>
                <Download size={18} />
                Export CSV
              </Button>
            </div>
          </div>

          {!selectedExamId ? (
            <Card
              variant="plain"
              className="text-center py-32 border-dashed border-2"
            >
              <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp size={40} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Select an exam to view insights
              </h2>
              <p className="text-slate-500 mt-2 max-w-xs mx-auto">
                Choose an assessment from the dropdown above to see performance
                metrics and student results.
              </p>
            </Card>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              <p className="text-slate-500 font-medium">
                Crunching the numbers...
              </p>
            </div>
          ) : results.length === 0 ? (
            <Card
              variant="plain"
              className="text-center py-32 border-dashed border-2"
            >
              <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users size={40} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                No submissions yet
              </h2>
              <p className="text-slate-500 mt-2 max-w-xs mx-auto">
                This exam hasn't received any submissions from students yet.
              </p>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    label: "Submissions",
                    value: totalStudents,
                    icon: Users,
                    color: "blue",
                  },
                  {
                    label: "Avg. Score",
                    value: `${averageScore}/10`,
                    icon: Target,
                    color: "purple",
                  },
                  {
                    label: "Pass Rate",
                    value: `${passRate}%`,
                    icon: CheckCircle2,
                    color: "emerald",
                  },
                  {
                    label: "Top Score",
                    value: `${topScore}/10`,
                    icon: Trophy,
                    color: "amber",
                  },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card variant="plain" className="flex items-center gap-5">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${stat.color}-100 text-${stat.color}-600`}
                      >
                        <stat.icon size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {stat.label}
                        </p>
                        <p className="text-2xl font-bold text-slate-900">
                          {stat.value}
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Score Distribution */}
                <Card variant="plain" className="lg:col-span-2">
                  <h3 className="text-lg font-bold text-slate-900 mb-8">
                    Score Distribution
                  </h3>
                  <div className="h-[300px]">
                    <Bar
                      data={scoreDistData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                          y: { beginAtZero: true, ticks: { stepSize: 1 } },
                        },
                      }}
                    />
                  </div>
                </Card>

                {/* Top Performers List */}
                <Card variant="plain">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">
                    Top Performers
                  </h3>
                  <div className="space-y-4">
                    {results
                      .sort((a, b) => (b.score || 0) - (a.score || 0))
                      .slice(0, 5)
                      .map((r, i) => (
                        <div
                          key={r.email || i}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
                              {(r.studentName || "U").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">
                                {r.studentName || "Unknown Student"}
                              </p>
                              <p className="text-[10px] text-slate-500">
                                {r.submittedAt
                                  ? new Date(r.submittedAt).toLocaleDateString()
                                  : "N/A"}
                              </p>
                            </div>
                          </div>
                          <Badge variant="success" className="font-mono">
                            {r.score || 0} / {r.totalQuestions || 10}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </Card>
              </div>

              {/* Detailed Results Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <h3 className="text-lg font-bold text-slate-900">
                    Student Breakdown
                  </h3>
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                    <input
                      type="text"
                      placeholder="Find student..."
                      className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/50 outline-none w-48"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/30">
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Student
                        </th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Email
                        </th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Submission
                        </th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
                          Final Score
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {results.map((row, idx) => (
                        <tr
                          key={row.email || idx}
                          className="hover:bg-slate-50/50 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                <User size={16} />
                              </div>
                              <span className="text-sm font-bold text-slate-700">
                                {row.studentName || "Unknown Student"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                            {row.email || "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                              <Clock size={14} />
                              {row.submittedAt
                                ? new Date(row.submittedAt).toLocaleString()
                                : "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex flex-col items-end">
                              <Badge
                                variant={
                                  (row.score || 0) >=
                                  (row.totalQuestions || 10) / 2
                                    ? "success"
                                    : "danger"
                                }
                                className="font-mono text-sm px-3"
                              >
                                {row.score} / {row.totalQuestions || 10}
                              </Badge>
                              <span className="text-[10px] text-slate-400 font-bold mt-1 uppercase">
                                {row.accuracy || 0}% Accuracy
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
}
