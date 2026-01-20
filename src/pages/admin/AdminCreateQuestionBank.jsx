import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";

const API_BASE = "https://online-assessment-platform-backend-1.onrender.com";

export default function AdminCreateQuestionBank() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  const [topicFilter, setTopicFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/questions`);
      console.log("QUESTIONS FROM DB:", res.data);
      setQuestions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      alert("Failed to load questions");
    }
  };

  const toggleQuestion = (id) => {
    setSelectedQuestions((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
    );
  };

  // ✅ FIX IS HERE (AUTH HEADER ADDED)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || selectedQuestions.length === 0) {
      alert("Question bank name and questions are required");
      return;
    }

    try {
      await axios.post(
        `${API_BASE}/api/question-banks`,
        {
          name,
          description,
          questions: selectedQuestions,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Question bank created successfully");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      alert("Create question bank failed (Unauthorized)");
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
    <div className="min-h-screen bg-gray-100 p-6">
      <AdminHeader />
      <br />

      <h2 className="text-2xl font-bold mb-4">Create Question Bank</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
        <div className="grid gap-4 mb-6">
          <input
            className="border p-2 rounded"
            placeholder="Question Bank Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            className="border p-2 rounded"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <select
            className="border p-2 rounded"
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

          <select
            className="border p-2 rounded"
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

        <h4 className="font-semibold mb-2">
          Select Questions ({selectedQuestions.length} selected)
        </h4>

        <div className="max-h-[400px] overflow-y-auto space-y-3 border p-4 rounded bg-gray-50">
          {filteredQuestions.map((q) => {
            const selected = selectedQuestions.includes(q._id);

            return (
              <div
                key={q._id}
                className={`p-4 rounded border cursor-pointer ${
                  selected
                    ? "bg-blue-50 border-blue-400"
                    : "bg-white hover:bg-gray-100"
                }`}
                onClick={() => toggleQuestion(q._id)}
              >
                <div className="flex gap-3">
                  <input type="checkbox" checked={selected} readOnly />

                  <div>
                    <p className="font-medium">{q.questionText}</p>
                    <div className="text-xs text-gray-600 mt-1 flex gap-4">
                      <span>📘 Topic: {q.topic}</span>
                      <span>🎯 Difficulty: {q.difficulty}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="submit"
          className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
        >
          Create Question Bank
        </button>
      </form>
    </div>
  );
}
