import React, { useState } from "react";
import axios from "axios";

export default function AdminCreateQuestion() {
  const [form, setForm] = useState({
    questionText: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    topic: "",
    difficulty: "easy",
    type: "MCQ",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const updated = [...form.options];
    updated[index] = value;
    setForm({ ...form, options: updated });
  };

  const submitQuestion = async () => {
    try {
      await axios.post(
        "https://online-assessment-platform-backend-1.onrender.com/api/questions",
        form
      );
      alert("Question created");
      setForm({
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        topic: "",
        difficulty: "easy",
        type: "MCQ",
      });
    } catch (err) {
      alert("Failed to create question");
    }
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Create Question</h1>

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
        className="w-full border p-2 mb-2"
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      <button
        onClick={submitQuestion}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Create Question
      </button>
    </div>
  );
}
