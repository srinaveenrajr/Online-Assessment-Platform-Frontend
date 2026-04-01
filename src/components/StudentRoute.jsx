import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function StudentRoute({ children }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "student") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}
