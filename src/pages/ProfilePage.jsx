import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Camera,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Shield,
} from "lucide-react";
import axios from "axios";
import { API_BASE } from "../utils/constants";
import { updateUser } from "../store/slices/authSlice";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Input from "../components/ui/Input";
import PageTransition from "../components/ui/PageTransition";

export default function ProfilePage() {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Sync state if user data loads later
  React.useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <p className="text-slate-500 font-medium">Loading profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // In a real app, you'd have an endpoint like /api/users/profile
      // For this demo, we'll simulate the update
      const res = await axios.put(
        `${API_BASE}/api/auth/profile`,
        { name, email },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setSuccess("Profile updated successfully!");
      // Update Redux store with new user data
      if (res.data.user) {
        dispatch(updateUser(res.data.user));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.put(
        `${API_BASE}/api/auth/password`,
        { currentPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <PageTransition>
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-slate-900">
              Account Settings
            </h1>
            <p className="text-slate-500 mt-2">
              Manage your personal information and security preferences.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3 text-emerald-700 font-medium"
              >
                <CheckCircle2 size={20} />
                {success}
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-3 text-rose-700 font-medium"
              >
                <AlertCircle size={20} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sidebar / Avatar Section */}
            <div className="md:col-span-1 space-y-6">
              <Card variant="plain" className="text-center p-8">
                <div className="relative inline-block mb-6">
                  <div className="w-32 h-32 rounded-3xl bg-blue-600 flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-blue-500/30">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <button className="absolute -bottom-2 -right-2 p-2.5 bg-white rounded-xl shadow-lg border border-slate-100 text-blue-600 hover:scale-110 transition-transform">
                    <Camera size={18} />
                  </button>
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {user?.name}
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  {user?.role === "admin"
                    ? "System Administrator"
                    : "Platform Student"}
                </p>
                <div className="mt-6 pt-6 border-t border-slate-50 flex flex-col gap-2">
                  <Badge
                    variant="glass"
                    className="bg-blue-50 text-blue-600 border-blue-100 py-2"
                  >
                    Verified Account
                  </Badge>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">
                    Member Since
                  </p>
                  <p className="text-xs font-bold text-slate-700">March 2026</p>
                </div>
              </Card>

              <Card
                variant="gradient"
                className="from-slate-900 to-slate-800 text-white p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Shield size={20} className="text-blue-400" />
                  <h3 className="font-bold">Privacy & Security</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Your data is protected with enterprise-grade encryption. We
                  never share your personal information.
                </p>
                <button className="text-[10px] font-bold text-blue-400 hover:text-blue-300 uppercase tracking-widest transition-colors">
                  Learn more about security
                </button>
              </Card>
            </div>

            {/* Main Forms Section */}
            <div className="md:col-span-2 space-y-8">
              {/* Profile Information */}
              <Card variant="plain" className="p-8">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <User size={20} className="text-blue-600" />
                  Personal Information
                </h3>
                <form onSubmit={handleUpdateProfile} className="space-y-5">
                  <div className="grid grid-cols-1 gap-5">
                    <Input
                      label="Full Name"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto"
                    >
                      {loading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Save size={18} />
                      )}
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Card>

              {/* Password Change */}
              <Card variant="plain" className="p-8">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Lock size={20} className="text-rose-600" />
                  Change Password
                </h3>
                <form onSubmit={handleUpdatePassword} className="space-y-5">
                  <Input
                    label="Current Password"
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      label="New Password"
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Input
                      label="Confirm New Password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <div className="pt-4">
                    <Button
                      type="submit"
                      variant="secondary"
                      disabled={loading}
                      className="w-full sm:w-auto border-rose-100 text-rose-600 hover:bg-rose-50"
                    >
                      {loading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Lock size={18} />
                      )}
                      Update Password
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        </PageTransition>
      </main>

      <Footer />
    </div>
  );
}
