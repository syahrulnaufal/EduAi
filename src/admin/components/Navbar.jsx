import React from "react";

export default function Navbar({ toggleSidebar }) {
  return (
    <div className="w-full h-20 bg-white shadow flex items-center px-4 justify-between">
      <button
        className="p-3 rounded-lg bg-purple-500 text-white hover:bg-indigo-600"
        onClick={toggleSidebar}
      >
        ☰
      </button>
      <h1 className="text-lg font-bold">Edu AI Admin</h1>
    </div>
  );
}
