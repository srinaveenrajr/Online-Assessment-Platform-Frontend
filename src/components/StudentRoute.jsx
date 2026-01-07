import React from "react";
import { Navigate } from "react-router-dom";

export default function StudentRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "student") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}
