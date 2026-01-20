import { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from "../../components/AdminHeader";

export default function AdminAnalytics() {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  /* ===========================
     LOAD EXAMS
  =========================== */
  useEffect(() => {
    axios
      .get(
        "https://online-assessment-platform-backend-1.onrender.com/api/exams",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setExams(res.data);
      })
      .catch((err) => {
        console.error("Failed to load exams", err);
      });
  }, [token]);

  /* ===========================
     LOAD ANALYTICS
  =========================== */
  const loadAnalytics = (examId) => {
    if (!examId) return;

    setLoading(true);

    axios
      .get(
        `https://online-assessment-platform-backend-1.onrender.com/api/results/analytics/${examId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setRows(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Analytics fetch failed", err);
        setLoading(false);
      });
  };

  return (
    <div style={{ padding: "30px" }}>
      <AdminHeader />
      <br />

      <h2 style={{ marginBottom: "20px" }}>📊 Exam Analytics</h2>

      {/* EXAM SELECT */}
      <select
        value={selectedExam}
        onChange={(e) => {
          setSelectedExam(e.target.value);
          loadAnalytics(e.target.value);
        }}
        style={{
          padding: "10px",
          marginBottom: "25px",
          width: "320px",
          fontSize: "14px",
        }}
      >
        <option value="">Select Exam</option>
        {exams.map((exam) => (
          <option key={exam._id} value={exam._id}>
            {exam.title}
          </option>
        ))}
      </select>

      {loading && <h3>Loading analytics...</h3>}

      {!loading && rows.length === 0 && selectedExam && (
        <p>No analytics available for this exam.</p>
      )}

      {!loading && rows.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "600px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#1f2937", color: "#ffffff" }}>
                <th style={thStyle}>#</th>
                <th style={thStyle}>User</th>
                <th style={thStyle}>Exam</th>
                <th style={thStyle}>Attempts</th>
                <th style={thStyle}>Latest Score</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#f9fafb" : "#ffffff",
                  }}
                >
                  <td style={tdCenter}>{index + 1}</td>
                  <td style={tdLeft}>{row.username}</td>
                  <td style={tdLeft}>{row.examTitle}</td>
                  <td style={tdCenter}>{row.attempts}</td>
                  <td style={tdCenter}>{row.latestScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ===========================
   TABLE STYLES
=========================== */
const thStyle = {
  padding: "12px",
  border: "1px solid #e5e7eb",
  textAlign: "center",
  fontWeight: "600",
};

const tdLeft = {
  padding: "10px",
  border: "1px solid #e5e7eb",
  textAlign: "left",
};

const tdCenter = {
  padding: "10px",
  border: "1px solid #e5e7eb",
  textAlign: "center",
};
