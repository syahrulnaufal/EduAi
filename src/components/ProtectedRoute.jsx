import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { getCurrentUser } from "../services/authservice";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        Swal.fire({
          icon: "warning",
          title: "Harus Login",
          text: "Silakan login terlebih dahulu",
          confirmButtonText: "OK"
        }).then(() => {
          navigate("/login");
        });
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    }
    fetchUser();
  }, [navigate]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return user ? children : null;
}

export default ProtectedRoute;
