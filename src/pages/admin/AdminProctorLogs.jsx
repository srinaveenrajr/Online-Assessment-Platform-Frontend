import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  Search,
  Filter,
  User,
  Clock,
  FileText,
  AlertTriangle,
  Eye,
  MoreVertical,
  Loader2,
  Calendar,
} from "lucide-react";
import Navbar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { API_BASE } from "../../utils/constants";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import PageTransition from "../../components/ui/PageTransition";

export default function AdminProctorLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/proctor`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(res.data);
      } catch (err) {
        console.error("Failed to fetch proctor logs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [token]);

  const getViolationColor = (type) => {
    switch (type) {
      case "FULLSCREEN_EXIT":
        return "danger";
      case "TAB_SWITCH":
        return "warning";
      case "WEBCAM_BLOCKED":
        return "danger";
      default:
        return "neutral";
    }
  };

  const filteredLogs = logs.filter(
    (log) =>
      log.student?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.exam?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.type?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <PageTransition>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Proctoring Logs
              </h1>
              <p className="text-slate-500 mt-1">
                Monitor system violations and maintain assessment integrity.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-red-50 px-4 py-2 rounded-xl border border-red-100 text-red-600">
              <ShieldAlert size={20} className="animate-pulse" />
              <span className="text-sm font-bold uppercase tracking-wider">
                {logs.length} Violations Detected
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by student email, exam or violation type..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="secondary" className="px-4">
              <Filter size={20} />
              Export Logs
            </Button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              <p className="text-slate-500 font-medium">Securing logs...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <Card
              variant="plain"
              className="text-center py-20 border-dashed border-2"
            >
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldAlert size={40} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Clean Slate!</h2>
              <p className="text-slate-500 mt-2 max-w-xs mx-auto">
                No proctoring violations have been recorded for the selected
                criteria.
              </p>
            </Card>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Student
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Assessment
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Violation Type
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Details
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
                        Timestamp
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <AnimatePresence>
                      {filteredLogs.map((log) => (
                        <motion.tr
                          key={log._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="hover:bg-slate-50/50 transition-colors group"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                <User size={18} />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-900">
                                  {log.student?.name || "Unknown"}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {log.student?.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                              <FileText size={16} className="text-slate-400" />
                              {log.exam?.title}
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <Badge
                              variant={getViolationColor(log.type)}
                              className="font-mono text-[10px] tracking-tight"
                            >
                              {log.type}
                            </Badge>
                          </td>
                          <td className="px-6 py-5">
                            <p
                              className="text-xs text-slate-600 max-w-[200px] truncate"
                              title={log.message}
                            >
                              {log.message}
                            </p>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="inline-flex flex-col items-end">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                                <Calendar
                                  size={12}
                                  className="text-slate-400"
                                />
                                {new Date(log.createdAt).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium mt-0.5">
                                <Clock size={12} />
                                {new Date(log.createdAt).toLocaleTimeString()}
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
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
