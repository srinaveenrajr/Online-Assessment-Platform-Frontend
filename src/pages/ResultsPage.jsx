import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Trophy,
  Target,
  Calendar,
  ArrowRight,
  BookOpen,
  Layout,
  BarChart3,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { API_BASE } from "../utils/constants";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import PageTransition from "../components/ui/PageTransition";

export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem("token");
        // We'll need a backend endpoint for this.
        // For now, let's assume we can fetch all results for the logged-in student.
        // If the endpoint doesn't exist, we'll need to create it or adjust.
        const res = await axios.get(`${API_BASE}/api/results/my-results`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResults(res.data);
      } catch (err) {
        console.error("Failed to load results", err);
        setError("Failed to load your assessment results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <PageTransition>
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-slate-900">My Results</h1>
            <p className="text-slate-500 mt-2">
              Track your performance and review your completed assessments.
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              <p className="text-slate-500 font-medium">Loading results...</p>
            </div>
          ) : error ? (
            <Card variant="plain" className="text-center py-20">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={40} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{error}</h3>
              <Button
                onClick={() => window.location.reload()}
                className="mt-6"
                variant="secondary"
              >
                Try Again
              </Button>
            </Card>
          ) : results.length === 0 ? (
            <Card
              variant="plain"
              className="text-center py-20 border-dashed border-2"
            >
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Trophy size={40} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                No results found
              </h3>
              <p className="text-slate-500 max-w-xs mx-auto mt-2">
                You haven't completed any assessments yet.
              </p>
              <Button onClick={() => navigate("/dashboard")} className="mt-8">
                View Available Exams
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((result, i) => {
                const total = result.totalQuestions || 10;
                const accuracy = (result.score / total) * 100;
                const isPassed = accuracy >= 50;

                return (
                  <motion.div
                    key={result._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card
                      variant="plain"
                      className="group h-full flex flex-col hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <Badge variant={isPassed ? "success" : "danger"}>
                          {isPassed ? "PASSED" : "FAILED"}
                        </Badge>
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                          <BarChart3 size={20} />
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {result.exam?.title || "Assessment Result"}
                      </h3>

                      <div className="space-y-3 mt-auto pt-6 border-t border-slate-50">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-slate-500">
                            <Target size={16} />
                            <span>Score</span>
                          </div>
                          <span className="font-bold text-slate-900">
                            {result.score} / {total}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-slate-500">
                            <Calendar size={16} />
                            <span>Submitted on</span>
                          </div>
                          <span className="text-slate-700">
                            {new Date(result.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6">
                        <Button
                          variant="secondary"
                          onClick={() =>
                            navigate(
                              `/result/${result.exam?._id || result.exam}`,
                            )
                          }
                          className="w-full group-hover:bg-blue-600 group-hover:text-white transition-all"
                        >
                          View Detailed Analysis
                          <ArrowRight size={18} />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
}
