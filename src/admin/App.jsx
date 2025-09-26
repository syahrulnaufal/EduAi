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
            <Route path="/" element={<Beranda />} />
            <Route path="/users" element={<Users />} />
            <Route path="/kelas" element={<Kelas />} />
            <Route path="/pelajaran" element={<Pelajaran />} />
            <Route path="/pelajaran/:jenjangId/:pelajaranId" element={<Bab />} />
            <Route path="/pelajaran/:jenjangId/:pelajaranId/:babId" element={<SubBab />} />
            <Route path="/quiz/:pelajaranId/:babId" element={<Quiz />} />
            <Route path="/quiz/:pelajaranId/:babId/:quizId" element={<Soal />} />
            <Route path="/guru" element={<Guru />} />
            <Route path="/course" element={<Course />} />
            <Route path="/pembelian" element={<Pembelian />} />
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
}

export default App;
