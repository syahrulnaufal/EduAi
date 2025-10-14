import React, { useState } from "react";
import { HashRouter, Routes, Route } from 'react-router-dom'
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Beranda from "./pages/Beranda";
import Users from "./pages/users";
import Kelas from "./pages/kelas";
import Pelajaran from "./pages/pelajaran";
import Bab from "./pages/bab";
import SubBab from "./pages/subbab";
import Quiz from "./pages/quiz";
import Soal from "./pages/soal";
import Course from "./pages/course";
import Guru from "./pages/guru";
import Pembelian from "./pages/pembayaran";
import AdminRoute from "./components/Adminroutes";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <HashRouter>
      <div className="flex">
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <div className="flex-1 min-h-screen bg-gray-100">
          <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <Routes>
      <Route
        path="/"
        element={
          <AdminRoute>
            <Beranda />
          </AdminRoute>
        }
      />
      <Route
        path="/users"
        element={
          <AdminRoute>
            <Users />
          </AdminRoute>
        }
      />
      <Route
        path="/kelas"
        element={
          <AdminRoute>
            <Kelas />
          </AdminRoute>
        }
      />
      <Route
        path="/pelajaran"
        element={
          <AdminRoute>
            <Pelajaran />
          </AdminRoute>
        }
      />
      <Route
        path="/pelajaran/:jenjangId/:pelajaranId"
        element={
          <AdminRoute>
            <Bab />
          </AdminRoute>
        }
      />
      <Route
        path="/pelajaran/:jenjangId/:pelajaranId/:babId"
        element={
          <AdminRoute>
            <SubBab />
          </AdminRoute>
        }
      />
      <Route
        path="/quiz/:pelajaranId/:babId"
        element={
          <AdminRoute>
            <Quiz />
          </AdminRoute>
        }
      />
      <Route
        path="/quiz/:pelajaranId/:babId/:quizId"
        element={
          <AdminRoute>
            <Soal />
          </AdminRoute>
        }
      />
      <Route
        path="/guru"
        element={
          <AdminRoute>
            <Guru />
          </AdminRoute>
        }
      />
      <Route
        path="/course"
        element={
          <AdminRoute>
            <Course />
          </AdminRoute>
        }
      />
      <Route
        path="/pembelian"
        element={
          <AdminRoute>
            <Pembelian />
          </AdminRoute>
        }
      />
    </Routes>
        </div>
      </div>
    </HashRouter>
  );
}

export default App;
