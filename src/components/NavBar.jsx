import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  User,
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Settings,
  Menu,
  X,
  ChevronDown,
  Bell,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { logout, markNotificationsRead } from "../store/slices/authSlice";
import Button from "./ui/Button";
import Badge from "./ui/Badge";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, notifications } = useSelector((state) => state.auth);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    dispatch(markNotificationsRead());
  };

  const handleViewAll = () => {
    setIsNotificationsOpen(false);
    navigate("/notifications");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navLinks =
    user?.role === "admin"
      ? [
          {
            name: "Dashboard",
            path: "/admin/dashboard",
            icon: LayoutDashboard,
          },
          {
            name: "Question Bank",
            path: "/admin/question-bank",
            icon: BookOpen,
          },
          { name: "Exams", path: "/admin/analytics", icon: BarChart3 },
        ]
      : [
          { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
          { name: "My Results", path: "/results", icon: BarChart3 },
        ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-xl shadow-xl py-3 border-b border-slate-100"
          : "bg-white/70 backdrop-blur-md py-4 border-b border-slate-100/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:rotate-12 transition-transform">
              <BookOpen size={24} />
            </div>
            <span
              className={`text-xl font-bold tracking-tight transition-colors duration-300 ${isScrolled ? "text-slate-900" : "text-slate-800"}`}
            >
              Assess<span className="text-blue-600">Pro</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold transition-colors duration-300 hover:text-blue-600 flex items-center gap-2 ${
                  location.pathname === link.path
                    ? "text-blue-600"
                    : isScrolled
                      ? "text-slate-900"
                      : "text-slate-600"
                }`}
              >
                <link.icon size={18} />
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`p-2 rounded-full transition-colors relative group ${isScrolled ? "text-slate-900 hover:bg-slate-100" : "text-slate-600 hover:bg-slate-50"}`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white group-hover:scale-125 transition-transform"></span>
                )}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50"
                  >
                    <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900">
                        Notifications
                      </h3>
                      <button
                        onClick={markAllAsRead}
                        className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest"
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-[320px] overflow-y-auto divide-y divide-slate-50">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer group ${!notif.read ? "bg-blue-50/30" : ""}`}
                          >
                            <div className="flex gap-3">
                              <div
                                className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                  notif.type === "success"
                                    ? "bg-emerald-50 text-emerald-500"
                                    : notif.type === "warning"
                                      ? "bg-amber-50 text-amber-500"
                                      : "bg-blue-50 text-blue-500"
                                }`}
                              >
                                {notif.type === "success" ? (
                                  <CheckCircle2 size={16} />
                                ) : notif.type === "warning" ? (
                                  <AlertCircle size={16} />
                                ) : (
                                  <Bell size={16} />
                                )}
                              </div>
                              <div className="space-y-1">
                                <p
                                  className={`text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors ${!notif.read ? "pr-2 relative after:content-[''] after:absolute after:top-1 after:right-0 after:w-1.5 after:h-1.5 after:bg-blue-500 after:rounded-full" : ""}`}
                                >
                                  {notif.title}
                                </p>
                                <p className="text-[11px] text-slate-500 leading-relaxed">
                                  {notif.message}
                                </p>
                                <p className="text-[10px] font-medium text-slate-400">
                                  {notif.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center">
                          <p className="text-xs text-slate-400 font-medium">
                            No notifications
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                      <button
                        onClick={handleViewAll}
                        className="text-[10px] font-bold text-slate-500 hover:text-blue-600 uppercase tracking-widest transition-colors"
                      >
                        View All Notifications
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center gap-2 p-1 pr-3 rounded-full transition-all ${
                  isScrolled
                    ? "bg-slate-100 hover:bg-slate-200 shadow-sm"
                    : "bg-slate-50 hover:bg-slate-100"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span
                  className={`text-sm font-medium ${isScrolled ? "text-slate-900" : "text-slate-700"}`}
                >
                  {user?.name || "User"}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${isScrolled ? "text-slate-900" : "text-slate-500"} ${isProfileOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-bottom border-slate-50">
                      <p className="text-sm font-bold text-slate-900">
                        {user?.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        <User size={18} /> Profile Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={18} /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-xl ${isScrolled ? "text-slate-900" : "text-slate-700"}`}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 text-slate-600 font-semibold"
                >
                  <link.icon size={20} />
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 p-3 rounded-xl text-red-600 font-semibold hover:bg-red-50"
                >
                  <LogOut size={20} /> Logout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
