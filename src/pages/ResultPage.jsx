import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Trophy,
  Target,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  BarChart3,
  Download,
  Share2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { API_BASE } from "../utils/constants";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import PageTransition from "../components/ui/PageTransition";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
);

export default function ResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/api/results/exam/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResult(res.data);
      } catch (err) {
        setError(
          "Result not found for this exam. It might still be processing.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium">
          Analyzing your performance...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
          <AlertCircle size={40} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Oops! Something went wrong
        </h1>
        <p className="text-slate-500 max-w-md mb-8">{error}</p>
        <Button onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={18} />
          Back to Dashboard
        </Button>
      </div>
    );

  const doughnutData = {
    labels: ["Correct", "Incorrect"],
    datasets: [
      {
        data: [
          result.score,
          Math.max(0, (result.totalQuestions || 10) - result.score),
        ],
        backgroundColor: ["#10b981", "#f43f5e"],
        hoverBackgroundColor: ["#059669", "#e11d48"],
        borderWidth: 0,
      },
    ],
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const accuracy =
    result.totalQuestions > 0
      ? Math.round((result.score / result.totalQuestions) * 100)
      : 0;

  const isPassed = accuracy >= 50; // Assuming 50% is pass threshold

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#1e293b",
        titleFont: { size: 12, weight: "bold" },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 12,
        displayColors: false,
      },
    },
    cutout: "80%",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <PageTransition>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 text-sm font-bold text-blue-600 mb-4 hover:gap-3 transition-all"
              >
                <ArrowLeft size={16} />
                BACK TO DASHBOARD
              </button>
              <h1 className="text-3xl font-bold text-slate-900">
                Performance Analysis
              </h1>
              <p className="text-slate-500 mt-1">{result.examTitle}</p>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" size="sm">
                <Download size={18} />
                Report
              </Button>
              <Button variant="primary" size="sm">
                <Share2 size={18} />
                Share
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Score Card */}
            <Card
              variant="plain"
              className="lg:col-span-2 overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-64 h-64 -mr-32 -mt-32 bg-blue-500/5 rounded-full"></div>

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-12">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                      <Trophy size={28} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                        Final Score
                      </p>
                      <h2 className="text-4xl font-black text-slate-900">
                        {result.score}{" "}
                        <span className="text-slate-300 text-2xl">
                          / {result.totalQuestions || 10}
                        </span>
                      </h2>
                    </div>
                  </div>
                  <Badge
                    variant={isPassed ? "success" : "danger"}
                    className="px-4 py-2 text-sm"
                  >
                    {isPassed ? "PASSED" : "FAILED"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {[
                    {
                      label: "Accuracy",
                      value: `${accuracy}%`,
                      icon: Target,
                      color: "blue",
                    },
                    {
                      label: "Time Taken",
                      value: formatDuration(result.timeTaken),
                      icon: BarChart3,
                      color: "purple",
                    },
                    {
                      label: "Rank",
                      value: result.rank !== "N/A" ? `#${result.rank}` : "N/A",
                      icon: Trophy,
                      color: "amber",
                    },
                    {
                      label: "Date",
                      value: new Date(result.submittedAt).toLocaleDateString(),
                      icon: Calendar,
                      color: "emerald",
                    },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div
                        className={`w-8 h-8 rounded-lg bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center mb-2`}
                      >
                        <stat.icon size={16} />
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {stat.label}
                      </p>
                      <p className="text-sm font-bold text-slate-900">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-4">
                  Strength Analysis
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      topic: "React Fundamentals",
                      progress: 90,
                      color: "blue",
                    },
                    { topic: "Data Structures", progress: 65, color: "purple" },
                    {
                      topic: "Problem Solving",
                      progress: 80,
                      color: "emerald",
                    },
                  ].map((item) => (
                    <div key={item.topic} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-600">{item.topic}</span>
                        <span className={`text-${item.color}-600`}>
                          {item.progress}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-slate-200">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.progress}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className={`h-full bg-${item.color}-500`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Visual Analytics */}
            <div className="space-y-8">
              <Card variant="plain" className="text-center">
                <h3 className="text-sm font-bold text-slate-900 mb-8 uppercase tracking-widest">
                  Accuracy Breakdown
                </h3>
                <div className="max-w-[200px] mx-auto relative">
                  <Doughnut data={doughnutData} options={chartOptions} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                    <span className="text-3xl font-black text-slate-900">
                      {accuracy}%
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Correct
                    </span>
                  </div>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                    <p className="text-[10px] font-bold text-emerald-600 uppercase">
                      Correct
                    </p>
                    <p className="text-lg font-bold text-emerald-700">
                      {result.score}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-100">
                    <p className="text-[10px] font-bold text-rose-600 uppercase">
                      Incorrect
                    </p>
                    <p className="text-lg font-bold text-rose-700">
                      {Math.max(
                        0,
                        (result.totalQuestions || 10) - result.score,
                      )}
                    </p>
                  </div>
                </div>
              </Card>

              <Card
                variant="gradient"
                className="from-slate-900 to-slate-800 text-white"
              >
                <h3 className="text-sm font-bold mb-4 uppercase tracking-widest opacity-70">
                  Expert Insight
                </h3>
                <p className="text-sm leading-relaxed mb-6 italic">
                  "Your performance in React Fundamentals is exceptional. Focus
                  on improving your Data Structures score to reach the top 5% of
                  candidates."
                </p>
                <Button variant="glass" className="w-full text-xs py-2">
                  Get Detailed Feedback
                </Button>
              </Card>
            </div>
          </div>
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
}
