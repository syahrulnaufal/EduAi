import React from "react";

export default function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // kalau belum login → redirect ke /login
  if (!user) {
    window.location.href = "/login";
    return null;
  }

  // kalau login tapi bukan admin → redirect ke /
  if (user.role !== "admin") {
    window.location.href = "/";
    return null;
  }

  // kalau admin → lanjut render children
  return children;
}
