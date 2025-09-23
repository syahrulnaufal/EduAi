import { createRoot } from 'react-dom/client'
import {BrowserRouter, Routes, Route} from 'react-router'
import Chatbot from './pages/Chatbot'
import Beranda from './pages/Beranda'
import RuangBelajar from './pages/RuangBelajar'
import RuangMateri from './pages/RuangMateri'
import RuangKelas from './pages/RuangKelas'
import BrainAcademy from './pages/BrainAcademy'
import MateriBelajarPage from './pages/MateriBelajarPage'
import LoginPage from './pages/LoginPage'
import './style.css'
import SignInPage from './pages/SignInPage'
import MathCoursePage from './pages/MathCoursePage'
import FiturPopuler from './pages/FiturPopuler'
import Curriculum from './pages/CurriculumPage'
import Profil from './pages/Profil'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<Beranda/>}/>
        <Route path="/" index element={<Beranda />} />
        <Route path="/ruang-belajar" element={<RuangBelajar/>} />
        <Route path='/ruang-belajar/:kelas' element={<RuangMateri/>} />
        <Route path='/ruang-belajar/:kelas/:materi' element={<MateriBelajarPage/>} />
        <Route path="/ruang-kelas" element={<RuangKelas />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/brain-academy" element={<BrainAcademy />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/math-course/:id" element={<MathCoursePage />} />
        <Route path="/fitur/:id" element={<FiturPopuler />} />
        <Route path="/fitur/:id/curriculum" element={<Curriculum />} />
        <Route path="/profile" element={<Profil />} />
      </Routes>
    </BrowserRouter>
)
