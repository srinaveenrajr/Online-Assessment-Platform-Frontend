import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminProctorLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/proctor")
      .then((res) => setLogs(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Proctoring Logs</h1>

      {logs.length === 0 && <p>No violations recorded.</p>}

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Student</th>
            <th className="border p-2">Exam</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Message</th>
            <th className="border p-2">Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id}>
              <td className="border p-2">{log.student?.email}</td>
              <td className="border p-2">{log.exam?.title}</td>
              <td className="border p-2">{log.type}</td>
              <td className="border p-2">{log.message}</td>
              <td className="border p-2">
                {new Date(log.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
