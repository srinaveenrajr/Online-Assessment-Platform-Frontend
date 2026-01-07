import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get(
        "https://online-assessment-platform-backend-1.onrender.com/api/analytics/summary"
      )
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!data) {
    return <div className="p-6">Loading analytics...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Exam Analytics</h1>

      <div className="border p-4 rounded bg-white">
        <p>
          <strong>Total Attempts:</strong> {data.totalAttempts}
        </p>
        <p>
          <strong>Average Score:</strong> {data.averageScore}
        </p>
      </div>
    </div>
  );
}
