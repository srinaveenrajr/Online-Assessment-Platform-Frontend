import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle, ShieldQuestion } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../utils/constants';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ParticleBackground from '../components/ui/ParticleBackground';

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post(`${API_BASE}/api/auth/forgot-password`, { email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process request. Please check your email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-slate-950">
      <ParticleBackground />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-600 text-white shadow-lg shadow-amber-500/30 mb-4"
          >
            <ShieldQuestion size={32} />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
          <p className="text-slate-400">No worries, we'll send you reset instructions.</p>
        </div>

        <Card variant="dark" className="border-slate-800/50 backdrop-blur-2xl p-8">
          <AnimatePresence mode="wait">
            {!success ? (
              <motion.form 
                key="form"
                onSubmit={handleSubmit} 
                className="space-y-6"
                exit={{ opacity: 0, x: -20 }}
              >
                {error && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium flex items-center gap-2">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors">
                      <Mail size={20} />
                    </div>
                    <input
                      type="email"
                      placeholder="Enter your registered email"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all text-white placeholder:text-slate-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-xl shadow-xl shadow-amber-500/20"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Send Reset Link"}
                </Button>
              </motion.form>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-center py-4"
              >
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Check your email</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                  We've sent a password reset link to <span className="text-white font-medium">{email}</span>.
                </p>
                <Button variant="secondary" className="w-full" onClick={() => setSuccess(false)}>
                  Didn't receive? Try again
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <Link to="/login" className="text-slate-400 hover:text-white font-bold text-sm inline-flex items-center gap-2 group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
