import React, { useRef, useState, useLayoutEffect, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Sidebar({ isOpen, toggleSidebar }) {
  const wrapperRef = useRef(null);
  const [indicator, setIndicator] = useState({ top: 236, height: 32, opacity: 1 });
  const location = useLocation();

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
          await fetch(`${API_URL}/api/auth/logout`, {
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
          window.location.href = `${API_URL}/login`;
        });
      }
    });
  };

  const measureIndicator = () => {
    if (!wrapperRef.current) return;
    const activeNav = wrapperRef.current.querySelector("a.active");
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
      className={`fixed md:static top-0 left-0 h-screen bg-white shadow-md z-50 overflow-hidden
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        md:w-72 w-64`}
    >
      <div className="relative flex h-full overflow-hidden">
        {/* Garis ungu */}
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

        {/* Isi Sidebar */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {/* Header/Logo */}
          <div className="flex flex-col items-center justify-center p-4 border-b border-gray-100" style={{ height: 236 }}>
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

          {/* Menu Navigasi */}
          <nav className="flex flex-col gap-1 px-2 py-4">
            {menus.map((menu) => (
              <div key={menu.path} className="relative">
                {menu.isLogout ? (
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left p-3 ml-4 rounded font-medium hover:bg-red-50 text-red-600"
                  >
                    {menu.label}
                  </button>
                ) : (
                  <NavLink
                    to={menu.path}
                    className={({ isActive }) =>
                      `block p-3 ml-4 rounded font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-purple-100 text-purple-700 font-bold active"
                          : "hover:bg-indigo-50 text-gray-700"
                      }`
                    }
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

        {/* Tombol close (mobile only) */}
        <button
          className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full p-3 shadow-md md:hidden"
          onClick={toggleSidebar}
          aria-label="Tutup Sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
