import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Save,
  X,
  HelpCircle,
  Tag,
  BarChart,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Navbar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { API_BASE } from "../../utils/constants";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Input from "../../components/ui/Input";
import PageTransition from "../../components/ui/PageTransition";

export default function AdminQuestionManager() {
  const [questions, setQuestions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [form, setForm] = useState({
    questionText: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    topic: "",
    difficulty: "easy",
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/questions`);
      setQuestions(res.data);
    } catch {
      console.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const updated = [...form.options];
    updated[index] = value;
    setForm({ ...form, options: updated });
  };

  const resetForm = () => {
    setForm({
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      topic: "",
      difficulty: "easy",
    });
    setEditingId(null);
  };

  const submitQuestion = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await axios.put(`${API_BASE}/api/questions/${editingId}`, form);
      } else {
        await axios.post(`${API_BASE}/api/questions`, form);
      }
      resetForm();
      fetchQuestions();
    } catch {
      alert("Failed to save question. Please check all fields.");
    } finally {
      setSubmitting(false);
    }
  };

  const editQuestion = (q) => {
    setEditingId(q._id);
    setForm({
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      topic: q.topic,
      difficulty: q.difficulty,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteQuestion = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;
    try {
      await axios.delete(`${API_BASE}/api/questions/${id}`);
      fetchQuestions();
    } catch {
      alert("Failed to delete question");
    }
  };

  const filteredQuestions = questions.filter(
    (q) =>
      q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <PageTransition>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Question Form */}
            <div className="lg:col-span-5">
              <div className="sticky top-24">
                <Card variant="plain" className="border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${editingId ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"}`}
                    >
                      {editingId ? <Edit2 size={20} /> : <Plus size={20} />}
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {editingId ? "Edit Question" : "Create New Question"}
                    </h2>
                  </div>

                  <form onSubmit={submitQuestion} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">
                        Question Text
                      </label>
                      <textarea
                        name="questionText"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all min-h-[120px] resize-none"
                        placeholder="Type your question here..."
                        value={form.questionText}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">
                          Topic
                        </label>
                        <div className="relative">
                          <Tag
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            size={16}
                          />
                          <input
                            type="text"
                            name="topic"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                            placeholder="e.g. React"
                            value={form.topic}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">
                          Difficulty
                        </label>
                        <div className="relative">
                          <BarChart
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            size={16}
                          />
                          <select
                            name="difficulty"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all appearance-none cursor-pointer"
                            value={form.difficulty}
                            onChange={handleChange}
                          >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-700 ml-1">
                        Options
                      </label>
                      {form.options.map((opt, idx) => (
                        <div
                          key={idx}
                          className="flex gap-3 items-center group"
                        >
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm border-2 transition-colors ${
                              form.correctAnswer === opt && opt !== ""
                                ? "bg-emerald-500 border-emerald-400 text-white"
                                : "bg-slate-100 border-slate-200 text-slate-400"
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}
                          </div>
                          <input
                            type="text"
                            className={`flex-1 px-4 py-2.5 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all ${
                              form.correctAnswer === opt && opt !== ""
                                ? "border-emerald-500 ring-1 ring-emerald-500/20"
                                : "border-slate-200"
                            }`}
                            placeholder={`Option ${idx + 1}`}
                            value={opt}
                            onChange={(e) =>
                              handleOptionChange(idx, e.target.value)
                            }
                            required
                          />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">
                        Correct Answer
                      </label>
                      <select
                        name="correctAnswer"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all cursor-pointer"
                        value={form.correctAnswer}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Correct Option</option>
                        {form.options.map((opt, idx) => (
                          <option key={idx} value={opt} disabled={!opt}>
                            Option {String.fromCharCode(65 + idx)}:{" "}
                            {opt || "(Empty)"}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="submit"
                        className="flex-1"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <Loader2 className="animate-spin" />
                        ) : editingId ? (
                          "Update Question"
                        ) : (
                          "Create Question"
                        )}
                        {!submitting && <Save size={18} />}
                      </Button>
                      {editingId && (
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={resetForm}
                        >
                          <X size={18} />
                        </Button>
                      )}
                    </div>
                  </form>
                </Card>
              </div>
            </div>

            {/* Right: Question List */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="text-blue-600" size={24} />
                  Question Bank ({questions.length})
                </h2>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search questions..."
                    className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition-all w-full sm:w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 rounded-2xl shimmer"></div>
                  ))}
                </div>
              ) : filteredQuestions.length === 0 ? (
                <Card
                  variant="plain"
                  className="text-center py-16 border-dashed border-2"
                >
                  <p className="text-slate-400 font-medium">
                    No questions found matching your criteria.
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {filteredQuestions.map((q) => (
                      <motion.div
                        key={q._id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        <Card
                          variant="plain"
                          className={`group border-slate-200 hover:border-blue-500/50 transition-all duration-300 ${editingId === q._id ? "ring-2 ring-blue-500/20 border-blue-500" : ""}`}
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div className="space-y-3 flex-1">
                              <div className="flex flex-wrap gap-2">
                                <Badge
                                  variant="neutral"
                                  className="bg-slate-100 text-slate-600 border-slate-200"
                                >
                                  {q.topic}
                                </Badge>
                                <Badge
                                  variant={
                                    q.difficulty === "easy"
                                      ? "success"
                                      : q.difficulty === "medium"
                                        ? "warning"
                                        : "danger"
                                  }
                                >
                                  {q.difficulty}
                                </Badge>
                              </div>
                              <p className="text-slate-900 font-semibold leading-relaxed">
                                {q.questionText}
                              </p>
                              <div className="grid grid-cols-2 gap-x-6 gap-y-2 pt-2">
                                {q.options.map((opt, i) => (
                                  <div
                                    key={i}
                                    className={`text-xs flex items-center gap-2 ${q.correctAnswer === opt ? "text-emerald-600 font-bold" : "text-slate-500"}`}
                                  >
                                    <div
                                      className={`w-1.5 h-1.5 rounded-full ${q.correctAnswer === opt ? "bg-emerald-500" : "bg-slate-300"}`}
                                    ></div>
                                    <span className="truncate">{opt}</span>
                                    {q.correctAnswer === opt && (
                                      <CheckCircle2 size={12} />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => editQuestion(q)}
                                className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => deleteQuestion(q._id)}
                                className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
}
