import React from "react";
import { motion } from "framer-motion";
import { Bell, CheckCircle2, AlertCircle, Info, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { markNotificationsRead } from "../store/slices/authSlice";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import PageTransition from "../components/ui/PageTransition";

export default function NotificationsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.auth);

  const handleMarkAllRead = () => {
    dispatch(markNotificationsRead());
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <PageTransition>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-white rounded-xl transition-colors text-slate-500 hover:text-blue-600 border border-transparent hover:border-slate-200"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Notifications
                </h1>
                <p className="text-slate-500 mt-1">
                  Stay updated with your latest activities and alerts.
                </p>
              </div>
            </div>

            {notifications.some((n) => !n.read) && (
              <Button variant="secondary" size="sm" onClick={handleMarkAllRead}>
                Mark all as read
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notif, i) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card
                    variant="plain"
                    className={`p-6 border-l-4 transition-all hover:shadow-md ${
                      !notif.read
                        ? "bg-white border-l-blue-600"
                        : "bg-slate-50/50 border-l-slate-200"
                    }`}
                  >
                    <div className="flex gap-4">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                          notif.type === "success"
                            ? "bg-emerald-50 text-emerald-500"
                            : notif.type === "warning"
                              ? "bg-amber-50 text-amber-500"
                              : "bg-blue-50 text-blue-500"
                        }`}
                      >
                        {notif.type === "success" ? (
                          <CheckCircle2 size={24} />
                        ) : notif.type === "warning" ? (
                          <AlertCircle size={24} />
                        ) : (
                          <Info size={24} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h3
                            className={`font-bold text-slate-900 ${!notif.read ? "text-lg" : "text-base"}`}
                          >
                            {notif.title}
                          </h3>
                          <span className="text-xs font-medium text-slate-400">
                            {notif.time}
                          </span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                          {notif.message}
                        </p>
                        {!notif.read && (
                          <div className="mt-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                              New notification
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card
                variant="plain"
                className="text-center py-20 border-dashed border-2"
              >
                <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bell size={40} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  All caught up!
                </h2>
                <p className="text-slate-500 mt-2">
                  You don't have any new notifications at the moment.
                </p>
                <Button
                  variant="secondary"
                  className="mt-8"
                  onClick={() => navigate("/dashboard")}
                >
                  Return to Dashboard
                </Button>
              </Card>
            )}
          </div>
        </PageTransition>
      </main>

      <Footer />
    </div>
  );
}
