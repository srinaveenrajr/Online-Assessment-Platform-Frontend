import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from "../../components/AdminHeader";
import { API_BASE } from "../../utils/constants";

export default function AdminQuestionManager() {
  const [questions, setQuestions] = useState([]);
  const [editingId, setEditingId] = useState(null);

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

  /* ================= FETCH ================= */
  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/questions`);
      setQuestions(res.data);
    } catch {
      alert("Failed to load questions");
    }
  };

  /* ================= FORM HANDLERS ================= */
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

  /* ================= CREATE / UPDATE ================= */
  const submitQuestion = async () => {
    try {
      if (editingId) {
        await axios.put(`${API_BASE}/api/questions/${editingId}`, form);
        alert("Question updated");
      } else {
        await axios.post(`${API_BASE}/api/questions`, form);
        alert("Question created");
      }

      resetForm();
      fetchQuestions();
    } catch {
      alert("Failed to save question");
    }
  };

  /* ================= EDIT ================= */
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

  /* ================= DELETE ================= */
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <AdminHeader />
      <br />

      <div className=" flex">
        {/* ================= FORM ================= */}
        <div className="bg-white p-6 rounded shadow max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">
            {editingId ? "Update Question" : "Create Question"}
          </h2>

          <input
            name="questionText"
            placeholder="Question"
            value={form.questionText}
            onChange={handleChange}
            className="w-full border p-2 mb-2"
          />

          {form.options.map((opt, i) => (
            <input
              key={i}
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(i, e.target.value)}
              className="w-full border p-2 mb-2"
            />
          ))}

          <input
            name="correctAnswer"
            placeholder="Correct Answer"
            value={form.correctAnswer}
            onChange={handleChange}
            className="w-full border p-2 mb-2"
          />

          <input
            name="topic"
            placeholder="Topic"
            value={form.topic}
            onChange={handleChange}
            className="w-full border p-2 mb-2"
          />

          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            className="w-full border p-2 mb-4"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <div className="flex gap-2">
            <button
              onClick={submitQuestion}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {editingId ? "Update Question" : "Create Question"}
            </button>

            {editingId && (
              <button
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* ================= LIST ================= */}
        <div className="max-w-5xl mx-auto mt-10">
          <h3 className="text-xl font-bold mb-4">All Questions</h3>

          <div className="space-y-3">
            {questions.map((q) => (
              <div
                key={q._id}
                className="bg-white p-4 rounded shadow flex justify-between items-start w-[700px]"
              >
                <div>
                  <p className="font-medium">{q.questionText}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    📘 {q.topic} | 🎯 {q.difficulty}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => editQuestion(q)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteQuestion(q._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {questions.length === 0 && (
              <p className="text-gray-500">No questions found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
