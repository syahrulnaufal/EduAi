
import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router";
function UserIcon({ size = 20 }) {
  const s = size;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block"
    >
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M4 20c0-3.3137 2.6863-6 6-6h4c3.3137 0 6 2.6863 6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LoginButton() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // handle logout available to this component
  function handleLogout() {

  Swal.fire({
    icon: "question",
    title: "Yakin mau logout?",
    showCancelButton: true,
    confirmButtonText: "Ya, Logout",
    cancelButtonText: "Batal"
  }).then(async (result) => {
    if (!result.isConfirmed) return;

    try {
      // Panggil API logout supaya session di server terhapus
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });
    } catch (err) {
      console.error("Logout API error:", err);
    }

    // clear client-side auth
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    
    Swal.fire({
      icon: "success",
      title: "Berhasil logout!",
      timer: 1500,
      showConfirmButton: false,
    });

    navigate("/login");
  });
}

return (
    <div className="flex items-center gap-2 box-border pe-4 relative">
      {!user ? (
        <>
          <NavLink to="/login">
            <button
              className="bg-my-bg text-base text-my-text cursor-pointer
                    hover:bg-my-blue/10 px-8 py-2 rounded-4xl border border-my-border transition duration-200"
            >
              Masuk
            </button>
          </NavLink>
          <NavLink to="/sign-in">
            <button
              className="bg-[#9E88EE] text-base text-white cursor-pointer
                    hover:bg-[#8c71ed] px-8 py-2 rounded-4xl transition duration-200"
            >
              Daftar
            </button>
          </NavLink>
        </>
      ) : (
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 px-4 py-2 rounded-4xl bg-my-bg border border-my-border hover:bg-my-blue/10 transition duration-200"
            aria-haspopup="true"
            aria-expanded={open}
          >
            <UserIcon size={20} />
            <span className="text-my-text text-base truncate max-w-[8rem]">
              {user?.name || user?.username || "User"}
            </span>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 z-50">
              <NavLink
                to="/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default LoginButton;