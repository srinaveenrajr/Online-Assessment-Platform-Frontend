import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  Trophy,
  Target,
  Layout,
} from "lucide-react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { API_BASE } from "../utils/constants";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import PageTransition from "../components/ui/PageTransition";

export default function Dashboard() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/api/exams`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const validExams = Array.isArray(res.data)
          ? res.data.filter(
              (exam) => exam && exam._id && exam.startTime && exam.endTime,
            )
          : [];

        setExams(validExams);
      } catch (err) {
        console.error("Failed to load exams", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const getExamStatus = (exam) => {
    const now = new Date();
    const start = new Date(exam.startTime);
    const end = new Date(exam.endTime);

    if (now < start) return "UPCOMING";
    if (now > end) return "EXPIRED";
    return "ACTIVE";
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <PageTransition>
          {/* Welcome Section */}
          <div className="mb-10">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold text-slate-900"
            >
              Welcome back, Student! 👋
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-slate-500 mt-2"
            >
              Ready to showcase your skills? Here are your available
              assessments.
            </motion.p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                label: "Active Exams",
                value: exams.filter((e) => getExamStatus(e) === "ACTIVE")
                  .length,
                icon: Target,
                color: "blue",
              },
              {
                label: "Upcoming",
                value: exams.filter((e) => getExamStatus(e) === "UPCOMING")
                  .length,
                icon: Calendar,
                color: "amber",
              },
              {
                label: "Completed",
                value: exams.filter((e) => getExamStatus(e) === "EXPIRED")
                  .length,
                icon: Trophy,
                color: "emerald",
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card
                  variant="plain"
                  className="flex items-center gap-5 hover:shadow-md transition-shadow"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${stat.color}-100 text-${stat.color}-600`}
                  >
                    <stat.icon size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">
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

          {/* Exams Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Layout className="text-blue-600" size={24} />
                Available Assessments
              </h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-64 rounded-2xl shimmer"></div>
                ))}
              </div>
            ) : exams.length === 0 ? (
              <Card variant="plain" className="text-center py-20">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <BookOpen size={40} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  No exams available
                </h3>
                <p className="text-slate-500 max-w-xs mx-auto mt-2">
                  Check back later for new assessment opportunities.
                </p>
              </Card>
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {exams.map((exam) => {
                  const status = getExamStatus(exam);
                  const isActive = status === "ACTIVE";

                  return (
                    <motion.div key={exam._id} variants={item}>
                      <Card
                        variant="plain"
                        className="group h-full flex flex-col hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300"
                      >
                        <div className="flex justify-between items-start mb-4">
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
                          <div className="p-2 rounded-lg bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                            <BookOpen size={20} />
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {exam.title}
                        </h3>

                        <div className="space-y-3 mt-auto pt-6 border-t border-slate-50">
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Calendar size={16} />
                            <span>
                              {new Date(exam.startTime).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Clock size={16} />
                            <span>
                              {new Date(exam.startTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}{" "}
                              -
                              {new Date(exam.endTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="mt-6 flex gap-3">
                          {status === "ACTIVE" ? (
                            <Button
                              onClick={() => navigate(`/exam/${exam._id}`)}
                              className="w-full"
                            >
                              Start Exam
                              <ArrowRight size={18} />
                            </Button>
                          ) : status === "EXPIRED" ? (
                            <Button
                              variant="secondary"
                              onClick={() => navigate(`/result/${exam._id}`)}
                              className="w-full"
                            >
                              View Result
                            </Button>
                          ) : (
                            <Button
                              variant="secondary"
                              disabled
                              className="w-full"
                            >
                              Locked
                            </Button>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
}
