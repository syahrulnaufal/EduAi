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
import ProtectedRoute from "./components/ProtectedRoute"
import WatchMateriVideo from './pages/WatchMateriVideo'
import ExamPage from './pages/ExamPage'
import PembahasanExam from './pages/PembahasanExam'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<Beranda/>}/>
        <Route path="/" index element={<Beranda />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        
        {/* Protected Routes - Require Authentication */}
        <Route path="/ruang-belajar" element={<ProtectedRoute><RuangBelajar/></ProtectedRoute>} />
        <Route path='/ruang-belajar/:id' element={<ProtectedRoute><RuangMateri/></ProtectedRoute>} />
        <Route path='/ruang-belajar/:id/:materi' element={<ProtectedRoute><MateriBelajarPage/></ProtectedRoute>} />
        <Route path='/ruang-belajar/:id/:materi/:subbab' element={<ProtectedRoute><WatchMateriVideo/></ProtectedRoute>} />
        <Route path="/ruang-kelas" element={<ProtectedRoute><RuangKelas /></ProtectedRoute>} />
        <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
        <Route path="/brain-academy" element={<ProtectedRoute><BrainAcademy /></ProtectedRoute>} />
        <Route path="/math-course/:id" element={<ProtectedRoute><MathCoursePage /></ProtectedRoute>} />
        <Route path="/fitur/:id" element={<ProtectedRoute><FiturPopuler /></ProtectedRoute>} />
        <Route path="/fitur/:id/curriculum" element={<ProtectedRoute><Curriculum /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profil /></ProtectedRoute>} />
        <Route path="/exam" element={<ProtectedRoute><ExamPage /></ProtectedRoute>} />
        <Route path="/exam/pembahasan" element={<ProtectedRoute><PembahasanExam /></ProtectedRoute>} />  
      </Routes>
    </BrowserRouter>
)