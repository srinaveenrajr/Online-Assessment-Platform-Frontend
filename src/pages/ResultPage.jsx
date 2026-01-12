import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function ResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `http://localhost:5000/api/results/exam/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setResult(res.data);
      } catch (err) {
        setError("Result not found for this exam");
      }
    };

    fetchResult();
  }, [id]);

  return (
    <>
      <Navbar />

      <div className="p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Exam Result</h1>

        {error && <p className="text-red-600">{error}</p>}

        {result && (
          <div className="border p-4 rounded">
            <p>
              <strong>Exam:</strong> {result.examTitle}
            </p>
            <p>
              <strong>Score:</strong> {result.score}
            </p>
            <p>
              <strong>Submitted At:</strong>{" "}
              {new Date(result.submittedAt).toLocaleString("en-IN")}
            </p>
          </div>
        )}

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Back to Dashboard
        </button>
      </div>
    </>
  );
}
