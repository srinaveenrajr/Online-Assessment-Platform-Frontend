import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminCreateQuestionBank() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/questions", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setQuestions(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load questions");
      }
    };

    fetchQuestions();
  }, []);

  const toggleQuestion = (id) => {
    setSelectedQuestions((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/question-banks",
        {
          name,
          description,
          questions: selectedQuestions, // ✅ ObjectIds only
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Question bank created");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to create question bank");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Question Bank</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Question Bank Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <br />
        <br />

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <br />
        <br />

        <h4>Select Questions</h4>

        {questions.map((q) => (
          <div key={q._id}>
            <input
              type="checkbox"
              checked={selectedQuestions.includes(q._id)}
              onChange={() => toggleQuestion(q._id)}
            />{" "}
            {q.questionText}
          </div>
        ))}

        <br />
        <button type="submit">Create Question Bank</button>
      </form>
    </div>
  );
}
