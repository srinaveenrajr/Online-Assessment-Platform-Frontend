import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../components/NavBar";

export default function ResultPage() {
  const { id } = useParams(); // exam ID
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const token = localStorage.getItem("token");
        // Updated API endpoint
        const res = await axios.get(
          `http://localhost:5000/api/results/exam/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setResult(res.data);
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Error fetching result");
      }
    };

    fetchResult();
  }, [id]);

  if (!result) return <div className="p-8 text-white">Loading result...</div>;

  return (
    <>
      <Navbar />
      <div className="p-8 min-h-screen bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-4">Your Result</h1>
        <p className="text-xl mb-6">Score: {result.score}</p>

        {result.answers && result.answers.length > 0 ? (
          <div>
            {result.answers.map((ans, idx) => (
              <div key={idx} className="mb-4">
                <p className="font-semibold">Question ID: {ans.questionId}</p>
                <p>Your Answer: {ans.selectedAnswer}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No answers submitted.</p>
        )}
      </div>
    </>
  );
}
