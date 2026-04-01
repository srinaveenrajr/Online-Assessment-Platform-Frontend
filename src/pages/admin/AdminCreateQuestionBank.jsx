import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Library,
  Search,
  Filter,
  CheckCircle2,
  X,
  Plus,
  BookOpen,
  Tag,
  BarChart,
  ChevronRight,
  Info,
  Loader2,
  Save,
} from "lucide-react";
import Navbar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { API_BASE } from "../../utils/constants";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import PageTransition from "../../components/ui/PageTransition";

export default function AdminCreateQuestionBank() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [topicFilter, setTopicFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/questions`);
      setQuestions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestion = (id) => {
    setSelectedQuestions((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id],
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || selectedQuestions.length === 0) {
      alert("Please provide a name and select at least one question.");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(
        `${API_BASE}/api/question-banks`,
        { name, description, questions: selectedQuestions },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to create question bank.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const topic = q.topic?.toLowerCase() || "";
    const difficulty = q.difficulty?.toLowerCase() || "";
    return (
      (topicFilter ? topic === topicFilter.toLowerCase() : true) &&
      (difficultyFilter ? difficulty === difficultyFilter.toLowerCase() : true)
    );
  });

  const uniqueTopics = [
    ...new Set(questions.map((q) => q.topic).filter(Boolean)),
  ];
  const uniqueDifficulties = [
    ...new Set(questions.map((q) => q.difficulty).filter(Boolean)),
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <PageTransition>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Create Question Bank
              </h1>
              <p className="text-slate-500 mt-1">
                Group questions by topic or difficulty for your assessments.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Badge
                variant="glass"
                className="bg-blue-100 text-blue-600 border-blue-200 px-4 py-2"
              >
                {selectedQuestions.length} Questions Selected
              </Badge>
              <Button
                onClick={handleSubmit}
                disabled={submitting || selectedQuestions.length === 0}
              >
                {submitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Save size={20} />
                )}
                Save Bank
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Metadata */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                <Card variant="plain" className="border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Info size={20} className="text-blue-500" />
                    Bank Details
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">
                        Bank Name
                      </label>
                      <input
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                        placeholder="e.g. React Senior Level"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">
                        Description (Optional)
                      </label>
                      <textarea
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all min-h-[100px] resize-none"
                        placeholder="Describe the purpose of this bank..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </div>
                </Card>

                <Card variant="plain" className="border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Filter size={20} className="text-blue-500" />
                    Quick Filters
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">
                        Topic
                      </label>
                      <select
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all cursor-pointer"
                        value={topicFilter}
                        onChange={(e) => setTopicFilter(e.target.value)}
                      >
                        <option value="">All Topics</option>
                        {uniqueTopics.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">
                        Difficulty
                      </label>
                      <select
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all cursor-pointer"
                        value={difficultyFilter}
                        onChange={(e) => setDifficultyFilter(e.target.value)}
                      >
                        <option value="">All Difficulties</option>
                        {uniqueDifficulties.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                    {(topicFilter || difficultyFilter) && (
                      <button
                        onClick={() => {
                          setTopicFilter("");
                          setDifficultyFilter("");
                        }}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-2"
                      >
                        <X size={14} /> Clear All Filters
                      </button>
                    )}
                  </div>
                </Card>
              </div>
            </div>

            {/* Right: Question Selection */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="text-blue-600" size={24} />
                  Available Questions
                </h2>
                <span className="text-sm text-slate-500 font-medium">
                  Showing {filteredQuestions.length} of {questions.length}{" "}
                  questions
                </span>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-28 rounded-2xl shimmer"></div>
                  ))}
                </div>
              ) : filteredQuestions.length === 0 ? (
                <Card
                  variant="plain"
                  className="text-center py-20 border-dashed border-2"
                >
                  <p className="text-slate-400 font-medium">
                    No questions match your filters.
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
                        <button
                          onClick={() => toggleQuestion(q._id)}
                          className={`w-full text-left group transition-all duration-300 ${
                            selectedQuestions.includes(q._id)
                              ? "ring-2 ring-blue-500 ring-offset-2"
                              : ""
                          }`}
                        >
                          <Card
                            variant="plain"
                            className={`relative border-slate-200 group-hover:border-blue-500/50 transition-all ${
                              selectedQuestions.includes(q._id)
                                ? "bg-blue-50/30 border-blue-200"
                                : ""
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              <div
                                className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                  selectedQuestions.includes(q._id)
                                    ? "bg-blue-600 border-blue-600 text-white"
                                    : "bg-white border-slate-200 group-hover:border-blue-400"
                                }`}
                              >
                                {selectedQuestions.includes(q._id) && (
                                  <Plus size={14} className="rotate-45" />
                                )}
                              </div>
                              <div className="space-y-2 flex-1">
                                <div className="flex gap-2">
                                  <Badge
                                    variant="neutral"
                                    className="bg-slate-100 text-slate-600 border-slate-200 text-[10px]"
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
                                    className="text-[10px]"
                                  >
                                    {q.difficulty}
                                  </Badge>
                                </div>
                                <p className="text-slate-900 font-semibold leading-relaxed">
                                  {q.questionText}
                                </p>
                              </div>
                            </div>
                          </Card>
                        </button>
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
