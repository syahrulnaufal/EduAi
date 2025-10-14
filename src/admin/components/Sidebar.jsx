import React, { useRef, useState, useLayoutEffect, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const wrapperRef = useRef(null); 
  const menuRefs = useRef([]); 
  const [indicator, setIndicator] = useState({ top: 236, height: 32, opacity: 1 });
  const location = useLocation();

  // daftar menu sidebar
  const menus = [
    { label: "Dashboard", path: "/" },
    { label: "Users", path: "/users" },
    { label: "Kelas", path: "/kelas" },
    { label: "Pelajaran", path: "/pelajaran" },
    { label: "Course", path: "/course" },
    { label: "Guru", path: "/guru" },
    { label: "Pembelian", path: "/pembelian" },
    { label: "Logout", path: "/logout", isLogout: true },
  ];

  const handleLogout = async () => {
  Swal.fire({
    title: "Yakin mau logout?",
    text: "Kamu akan keluar dari sesi ini.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ya, logout",
    cancelButtonText: "Batal",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await fetch("http://localhost:5000/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });
      } catch (err) {
        console.error("Logout error:", err);
      }

      localStorage.clear();

      Swal.fire({
        icon: "success",
        title: "Logout berhasil",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        window.location.href = "http://localhost:5173/login";
      });
    }
  });
};


  // hitung posisi garis ungu
  const measureIndicator = () => {
    if (!wrapperRef.current) return;
    const navLinks = wrapperRef.current.querySelectorAll("a");
    const activeNav = Array.from(navLinks).find((el) => el.classList.contains("active"));
    if (activeNav) {
      const rect = activeNav.getBoundingClientRect();
      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      setIndicator({
        top: rect.top - wrapperRect.top,
        height: rect.height - 8,
        opacity: 1,
      });
    } else {
      setIndicator((s) => ({ ...s, opacity: 0 }));
    }
  };

  useLayoutEffect(() => {
    measureIndicator();
  }, [location.pathname, isOpen]);

  useEffect(() => {
    window.addEventListener("resize", measureIndicator);
    return () => window.removeEventListener("resize", measureIndicator);
  }, []);

  return (
    <aside
      ref={wrapperRef}
      className={`fixed md:static top-0 left-0 h-screen bg-white shadow-md transition-all duration-300 overflow-hidden z-50
      ${isOpen ? "w-3/4 md:w-72" : "w-0"}`}
      style={{ maxWidth: isOpen ? undefined : 0 }}
    >
      {isOpen && (
        <div className="relative flex h-full">
          {/* garis ungu */}
          <div className="w-3 flex-shrink-0 relative">
            <span
              className="absolute left-1 w-1 rounded bg-purple-600 transition-all duration-300"
              style={{
                top: indicator.top,
                height: indicator.height,
                opacity: indicator.opacity,
              }}
            ></span>
          </div>

          {/* Tombol close */}
          <button
            className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full p-3 shadow-lg transition"
            onClick={toggleSidebar}
            aria-label="Tutup Sidebar"
            style={{ zIndex: 20 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* isi sidebar */}
          <div className="flex-1 overflow-auto">
            {/* header/logo */}
            <div className="flex flex-col items-center justify-center p-4" style={{ height: 236 }}>
              <img
                src="../logo.png"
                alt="Logo"
                className="mb-4 object-contain"
                style={{ height: 100, width: 100 }}
              />
              <div className="font-extrabold text-gray-500 text-2xl text-center">
                Edu AI Admin
              </div>
            </div>

            {/* menu navigasi */}
            <nav className="flex flex-col gap-2 px-4 mt-2">
              {menus.map((menu, idx) => (
                <div
                  key={menu.path}
                  ref={(el) => (menuRefs.current[idx] = el)}
                  className="relative"
                >
                  {menu.isLogout ? (
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left p-3 ml-6 rounded font-medium hover:bg-red-50 text-red-600"
                    >
                      {menu.label}
                    </button>
                  ) : (
                    <NavLink
                      to={menu.path}
                      className={({ isActive }) =>
                        `block p-3 ml-6 rounded font-medium ${
                          isActive
                            ? "bg-purple-100 text-purple-700 font-bold active"
                            : "hover:bg-indigo-50 text-gray-700"
                        }`
                      }
                      end={menu.path === "/admin"}
                      onClick={() => {
                        if (window.innerWidth < 768) toggleSidebar();
                      }}
                    >
                      {menu.label}
                    </NavLink>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </aside>
  );
}
