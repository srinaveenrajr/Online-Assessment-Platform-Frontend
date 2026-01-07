import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminCreateQuestionBank() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://online-assessment-platform-backend-1.onrender.com/api/questions"
      )
      .then((res) => setQuestions(res.data));
  }, []);

  const toggleQuestion = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
    );
  };

  const createBank = async () => {
    try {
      await axios.post(
        "https://online-assessment-platform-backend-1.onrender.com/api/question-banks",
        {
          name,
          description,
          questions: selected,
        }
      );
      alert("Question bank created");
      setName("");
      setDescription("");
      setSelected([]);
    } catch {
      alert("Failed to create bank");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create Question Bank</h1>

      <input
        placeholder="Bank Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full mb-2"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <h2 className="font-semibold mb-2">Select Questions</h2>

      {questions.map((q) => (
        <label key={q._id} className="block">
          <input
            type="checkbox"
            checked={selected.includes(q._id)}
            onChange={() => toggleQuestion(q._id)}
            className="mr-2"
          />
          {q.questionText}
        </label>
      ))}

      <button
        onClick={createBank}
        className="bg-green-600 text-white px-4 py-2 mt-4 rounded"
      >
        Create Bank
      </button>
    </div>
  );
}
