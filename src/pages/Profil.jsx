import React from "react";
import Topbar from "../components/Topbar";
import { useState } from "react";
import '../style.css'; 
import Sidebar from "../components/Sidebar";
import BurgerMenu from "../components/BurgerMenu";

// --- Helper Icons ---
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const OptionsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>;


function Profil(){
    // Sidebar state
    const [left, setLeft] = useState('-left-70') 
    const [bg, setBg] = useState('bg-transparent -z-10')
    const [isSidebarHidden, setIsSidebarHidden] = useState(true)
    const iconSize = '20px'
    const menuButton = <svg xmlns="http://www.w3.org/2000/svg" id='menu' height={iconSize} viewBox="0 -960 960 960" width={iconSize} className="fill-my-text dark:fill-my-text-dark"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>
    const closeButton = <svg xmlns="http://www.w3.org/2000/svg" id='close' height={iconSize} viewBox="0 -960 960 960" width={iconSize} className="fill-my-text dark:fill-my-text-dark"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>;
    const [menuIcon, setMenuIcon] = useState(isSidebarHidden? menuButton : closeButton)
    
    // Function to hide sidebar
    function hideSidebar (){
        if(isSidebarHidden){
            setLeft('left-0')
            setBg('bg-my-bg-dark/70 z-20')
            setIsSidebarHidden(false)
            setMenuIcon(closeButton)
          }else{
            setLeft('-left-70')
            setIsSidebarHidden(true)
            setBg('bg-transparent -z-10')
            setMenuIcon(menuButton)
        }
    }

    // --- Dummy Data ---
    const progressCourses = [
        { title: "Product Design", progress: "2/8 Watched" },
        { title: "Web Design", progress: "2/8 Watched" },
        { title: "App Mobile", progress: "2/8 Watched" },
    ];

    const learningVideos = [
        { thumbnail: "/img/thumbnailLearning1.png", category: "FRONTEND", title: "Beginner's Guide To Becoming A Professional Frontend Developer", tutor: "Prashant Kumar Singh" },
        { thumbnail: "/img/thumbnailLearning2.png", category: "UI/UX DESIGN", title: "Beginner's Guide To Becoming A Professional UI/UX Design", tutor: "Jane Cooper" },
        { thumbnail: "/img/thumbnailLearning3.png", category: "BACKEND", title: "Beginner's Guide To Becoming A Professional Backend Developer", tutor: "Robert Fox" },
    ];
    
    const mentors = [
        { name: "Tio Andriyanto", date: "21/12/2023", courseType: "FRONTEND", courseTitle: "Understanding Concept Of React" },
        { name: "Tegar Ihsan", date: "21/12/2023", courseType: "FRONTEND", courseTitle: "Understanding Concept Of React" },
    ];

    const profileMentors = [
        { name: "Faris", role: "Software Developer", avatar: "/img/photoFrame1.png" },
        { name: "Paoji Ahmad", role: "Software Developer", avatar: "/img/photoFrame2.png" },
        { name: "Ihsan", role: "Software Developer", avatar: "/img/photoFrame3.png" },
        { name: "Syahrull", role: "Software Developer", avatar: "/img/photoFrame4.png" },
        { name: "Rizal Jago", role: "Software Developer", avatar: "/img/photoFrame5.png" },
    ];

    return(
        <div className="bg-[#F4F7FE] min-h-screen">
            <Sidebar className='absolute' hideSidebar={hideSidebar} left={left} bg={bg}>
                <BurgerMenu icon={menuIcon} handleClick={hideSidebar}/>
            </Sidebar>

            <Topbar>
                <div className="flex items-center">
                    <BurgerMenu icon={menuIcon} handleClick={hideSidebar}/>
                </div>
                <div className="w-10">{/* Placeholder */}</div>
            </Topbar>
            
            <div className="flex flex-col lg:flex-row">
                <div className="flex-1 p-4 md:p-8 space-y-8">
                    <div className="w-full flex justify-center ">
                        <div className="relative w-full ">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <SearchIcon />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Search your course here..." 
                                className="w-full bg-white rounded-lg py-4 pl-12 pr-4 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
                            />
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6 md:p-8 rounded-2xl flex justify-between items-center">
                        <div>
                            <div className="text-lg mb-2 font-light">Online Course</div>
                            <h2 className="text-xl md:text-2xl font-bold">Asah Keterampilan Anda dengan <br/> Kursus Online Profesional</h2>
                            <button className="mt-4 bg-white text-purple-600 font-semibold py-2 px-6 rounded-lg">Join Now</button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {progressCourses.map((course, index) => (
                            <div key={index} className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-[#702DFF33] p-2 rounded-full">
                                        <img src="/img/notification.svg" alt="" className="w-5 h-5"/>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">{course.title}</p>
                                        <p className="text-sm text-gray-500">{course.progress}</p>
                                    </div>
                                </div>
                                <OptionsIcon />
                            </div>
                        ))}
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">Melanjutkan Vidio Pembelajaran</h3>
                            <div className="flex space-x-2">
                                <button className="bg-white p-2 rounded-full shadow-sm"><img src="/img/arrow-left.svg" alt="" className="w-5"/></button>
                                <button className="bg-white p-2 rounded-full shadow-sm"><img src="/img/arrow-left.svg" alt="" className="w-5 rotate-180"/></button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {learningVideos.map((video, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                    <img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover" />
                                    <div className="p-4">
                                        <span className="text-xs font-semibold text-purple-600 bg-purple-100 py-1 px-2 rounded-md">{video.category}</span>
                                        <h4 className="mt-2 font-bold text-gray-800">{video.title}</h4>
                                        <p className="text-sm text-gray-500 mt-1">{video.tutor}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-4">
                             <h3 className="text-xl font-bold text-gray-800">Your Mentor</h3>
                             <a href="#" className="text-sm font-semibold text-purple-600">See All</a>
                        </div>
                        <div className="bg-transparent sm:bg-white sm:p-4 rounded-xl shadow-sm">
                            {/* ✅ Header diubah ke 'md:grid' */}
                            <div className="hidden sm:grid grid-cols-4 gap-4 text-xs text-gray-500 font-semibold mb-4 px-4">
                                <span>INSTRUCTOR NAME & DATE</span>
                                <span className="ps-2">COURSE TYPE</span>
                                <span>COURSE TITLE</span>
                                <span className="ps-2">ACTIONS</span>
                            </div>
                            {/* ✅ Setiap baris diubah ke 'md:grid' */}
                            <div className="sm:hidden">
                                {mentors.map((mentor, index) => (
                                    <div key={index} className="flex flex-col mb-6 max-w-80 bg-white p-4">
                                        <div className="flex items-center space-x-3">
                                            <img src={`/img/photoFrame${index+1}.png`} alt={mentor.name} className="w-10 h-10 rounded-full" />
                                            <div>
                                                <p className="font-semibold text-gray-800">{mentor.name}</p>
                                                <p className="text-xs text-gray-400">{mentor.date}</p>
                                            </div>
                                        </div>
                                        {/* ✅ Margin atas (mt) hanya berlaku di mobile, dihilangkan di 'md' */}
                                        <div className="mt-3 md:mt-0">
                                            <span className="font-semibold text-sm py-2 px-4 bg-purple-100 text-purple-600 rounded-full w-fit">{mentor.courseType}</span>
                                        </div>
                                        <p className="text-sm text-gray-700 mt-3 md:mt-0">{mentor.courseTitle}</p>
                                        <div className="mt-4 md:mt-0">
                                            {/* ✅ Lebar tombol diubah menjadi responsif */}
                                            <button className="w-full text-blue-600 bg-blue-100 text-sm font-semibold py-2 px-4 rounded-lg">SHOW DETAILS</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="hidden sm:block">
                                {mentors.map((mentor, index) => (
                                    <div key={index} className="grid grid-cols-4 gap-2 items-center mb-2 p-4 hover:bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <img src={`/img/photoFrame${index+1}.png`} alt={mentor.name} className="w-10 h-10 rounded-full" />
                                            <div>
                                                <p className="font-semibold text-gray-800">{mentor.name}</p>
                                                <p className="text-xs text-gray-400">{mentor.date}</p>
                                            </div>
                                        </div>
                                        <span className="font-semibold text-sm py-2 px-4 bg-purple-100 text-purple-600 rounded-full w-fit">{mentor.courseType}</span>
                                        <p className="text-sm text-gray-700">{mentor.courseTitle}</p>
                                        <button className=" text-blue-600 bg-blue-100 text-sm font-semibold py-2 px-4 rounded-lg w-fit">SHOW DETAILS</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <aside className="w-full lg:w-96 bg-white p-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-lg">Your Profile</h3>
                        <OptionsIcon />
                    </div>
                    <div className="text-center">
                        <div
                            className="relative w-28 h-28 rounded-full flex items-center justify-center mx-auto"
                            style={{ background: 'conic-gradient(#8B5CF6 65%, #E5E7EB 0)' }}
                        >
                            <div className="absolute w-[104px] h-[104px] bg-white rounded-full"></div>
                            <img 
                                src="/img/photoFrame1.png" 
                                alt="Syarif" 
                                className="w-24 h-24 rounded-full relative z-10"
                            />
                        </div>
                        <h4 className="mt-4 font-bold text-gray-800">Selamat Pagi Syarif</h4>
                        <p className="text-sm text-gray-500">Lanjutkan Perjalananmu Dan Raih Targetmu</p>
                    </div>

                    <div>
                        <div className="flex h-32 overflow-x-scroll items-end">
                            <div className="flex justify-evenly items-end space-x-2 w-max " style={{ animation: 'grow 1s forwards' }}>
                                {[40, 60, 80, 50, 90, 70, 60, 80, 100, 70, 40, 60, 30, 80, 50, 90, 70, 60, 80].map((height, i) => (
                                    <div key={i} className="w-5 bg-purple-200 rounded-t-md flex items-end" style={{ height: `${height}%` }}>
                                        <div className="w-full h-[80%] bg-purple-300 rounded-t-md flex items-end">
                                            <div className="w-full h-[60%] bg-purple-400 rounded-t-md"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg">Your Mentor</h3>
                            <button className="bg-gray-100 p-1 rounded-md">+</button>
                        </div>
                        <div className="space-y-4">
                            {profileMentors.map((mentor, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <img src={mentor.avatar} alt={mentor.name} className="w-10 h-10 rounded-full" />
                                        <div>
                                            <p className="font-semibold text-gray-800">{mentor.name}</p>
                                            <p className="text-xs text-gray-500">{mentor.role}</p>
                                        </div>
                                    </div>
                                    <button className="bg-purple-100 text-purple-600 text-xs font-semibold py-1 px-4 rounded-full">Follow</button>
                                </div>
                            ))}
                        </div>
                        <button className="mt-8 w-full bg-gray-100 text-gray-700 font-semibold py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors duration-150">See All</button>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default Profil;