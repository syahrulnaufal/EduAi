import { createRoot } from 'react-dom/client'
import {BrowserRouter, Routes, Route} from 'react-router'
import Chatbot from './pages/Chatbot'
import Beranda from './pages/Beranda'
import RuangBelajar from './pages/RuangBelajar'
import RuangKelas from './pages/RuangKelas'
import Tentang from './pages/Tentang'
import BrainAcademy from './pages/BrainAcademy'
import './style.css'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <Routes>
        <Route path="/" index element={<Beranda />} />
        <Route path="/ruang-belajar" element={<RuangBelajar />} />
        <Route path="/ruang-kelas" element={<RuangKelas />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/tentang" element={<Tentang />} />
        <Route path="/brain-academy" element={<BrainAcademy />} />
      </Routes>
    </BrowserRouter>
)
