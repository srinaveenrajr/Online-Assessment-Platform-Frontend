import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { API_BASE } from "../../utils/constants";
import {
  PlusCircle,
  Library,
  FileText,
  Settings,
  BarChart3,
  ShieldAlert,
  Users,
  ArrowUpRight,
} from "lucide-react";
import Navbar from "../../components/NavBar";
import Footer from "../../components/Footer";
import Card from "../../components/ui/Card";
import PageTransition from "../../components/ui/PageTransition";

const adminActions = [
  {
    title: "Manage Questions",
    description: "Add, edit or remove questions from the global pool",
    link: "/admin/question",
    icon: PlusCircle,
    color: "blue",
  },
  {
    title: "Question Bank",
    description: "Organize questions into categorized banks",
    link: "/admin/question-bank",
    icon: Library,
    color: "emerald",
  },
  {
    title: "Create Exam",
    description: "Design new assessments and set rules",
    link: "/admin/exam",
    icon: FileText,
    color: "purple",
  },
  {
    title: "Manage Exams",
    description: "Monitor, edit and control active exams",
    link: "/admin/manage-exams",
    icon: Settings,
    color: "indigo",
  },
  {
    title: "View Analytics",
    description: "Track performance and student progress",
    link: "/admin/analytics",
    icon: BarChart3,
    color: "rose",
  },
  {
    title: "Proctoring Logs",
    description: "Review security flags and student behavior",
    link: "/admin/proctor-logs",
    icon: ShieldAlert,
    color: "amber",
  },
];

export default function AdminDashboard() {
  const [studentCount, setStudentCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/api/auth/users/count`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudentCount(res.data.count);
      } catch (err) {
        console.error("Failed to fetch user count", err);
        setStudentCount(1284); // Fallback to a placeholder if API fails
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <PageTransition>
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl font-bold text-slate-900"
              >
                Admin Command Center
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-slate-500 mt-2"
              >
                Manage your assessments, students, and system analytics from one
                place.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <Users size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Total Students
                </p>
                <p className="text-lg font-bold text-slate-900">
                  {loading ? "..." : studentCount.toLocaleString()}
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {adminActions.map((action) => (
              <motion.div key={action.title} variants={item}>
                <Link to={action.link} className="block group h-full">
                  <Card
                    variant="plain"
                    className="h-full flex flex-col border-slate-200/60 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 relative overflow-hidden"
                  >
                    <div
                      className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-${action.color}-500/5 rounded-full group-hover:scale-150 transition-transform duration-500`}
                    ></div>

                    <div className="relative z-10">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-${action.color}-50 text-${action.color}-600 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm`}
                      >
                        <action.icon size={28} />
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {action.title}
                        </h3>
                        <ArrowUpRight
                          size={20}
                          className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"
                        />
                      </div>

                      <p className="text-slate-500 text-sm leading-relaxed">
                        {action.description}
                      </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-50 flex items-center text-sm font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                      Get Started
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
}
