import React from "react";
import Topbar from "../components/Topbar";
import { useState } from "react";
import '../style.css'; 
import Sidebar from "../components/Sidebar";
import BurgerMenu from "../components/BurgerMenu";

function RuangKelas(){
    // Sidebar 
    const [left, setLeft] = useState('-left-70') 
    const [bg, setBg] = useState('bg-transparent -z-10')
    const [isSidebarHidden, setIsSidebarHidden] = useState(true)
    const iconSize = '20px'
    const menuButton = <svg xmlns="http://www.w3.org/2000/svg" id='menu' height={iconSize} viewBox="0 -960 960 960" width={iconSize} className="fill-my-text dark:fill-my-text-dark"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>
    const closeButton = <svg xmlns="http://www.w3.org/2000/svg" id='close' height={iconSize} viewBox="0 -960 960 960" width={iconSize} className="fill-my-text dark:fill-my-text-dark"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>;
    const [menuIcon, setMenuIcon] = useState(isSidebarHidden? menuButton : closeButton)
    
    // Function to hide the sidebar
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

    const today = new Date();
    const tanggal = Array.from({ length: 15 }).map((_, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() + index);
        const hari = {
            date: date,
            isSelected: date.getDate() === today.getDate() ? true : false,
        }
        return hari;
    });
    
    const [dates, setDates] = useState(tanggal);

    function selectDate(clickedIndex){
        if (clickedIndex >= 5) {
            return; 
        }

        const newDates = dates.map((date, index) => ({
            ...date,
            isSelected: index === clickedIndex,
        }));
    
        setDates(newDates);
        gantiMateri(clickedIndex);
    }

    // materi yang tersedia
    const allMateri = [
    // Array 1 (Data Asli)
    [{
        title: "Kimia",
        description: "UM Master: Kimia: Latihan Soal Kimia",
        isOnline: true,
        startTime: "07.45",
        endTime: "09.45",
        tutor: "Kak Triana",
        tanggal: "Senin, 20 Maret 2023",
        img: '/img/bgMateriKimia.png',
    }, {
        title: "IPA",
        description: "UM Master: IPA: Latihan Soal Campuran",
        isOnline: true,
        startTime: "11.15",
        endTime: "13.15",
        tutor: "Kak Uswa",
        tanggal: "Senin, 20 Maret 2023",
        img: '/img/bgMateriIPA.png',
    }, {
        title: "IPS",
        description: "UM Master: IPS: Latihan Soal Sejarah dan Geografi",
        isOnline: true,
        startTime: "07.45",
        endTime: "09.45",
        tutor: "Kak Triana",
        tanggal: "Senin, 20 Maret 2023",
        img: '/img/bgMateriIPS.png',
    }, {
        title: "Bahasa Inggris",
        description: "Kelas Kedinasan: Bahasa Inggris: Reading Comprehension",
        isOnline: true,
        startTime: "09.15",
        endTime: "10.45",
        tutor: "TA P",
        tanggal: "Senin, 20 Maret 2023",
        img: '/img/bgMateriInggris.png',
    }, {
        title: "Bahasa Indonesia",
        description: "UM Master: Bahasa Indonesia: Latihan Soal Pengetahuan Umum",
        isOnline: true,
        startTime: "11.35",
        endTime: "13.15",
        tutor: "Kak Ambar",
        tanggal: "Senin, 20 Maret 2023",
        img: '/img/bgMateriIndo.png',
    }, ],

    // Array 2
    [{
        title: "Bahasa Inggris",
        description: "TOEFL Prep: Structure and Written Expression",
        isOnline: true,
        startTime: "08.00",
        endTime: "10.00",
        tutor: "TA P",
        tanggal: "Selasa, 21 Maret 2023",
        img: '/img/bgMateriInggris.png',
    }, {
        title: "IPA",
        description: "Pendalaman Materi: Rangka Manusia",
        isOnline: true,
        startTime: "10.30",
        endTime: "12.30",
        tutor: "Kak Uswa",
        tanggal: "Selasa, 21 Maret 2023",
        img: '/img/bgMateriIPA.png',
    }, {
        title: "Kimia",
        description: "Kelas Kedinasan: Stoikiometri Lanjutan",
        isOnline: true,
        startTime: "13.00",
        endTime: "15.00",
        tutor: "Kak Triana",
        tanggal: "Selasa, 21 Maret 2023",
        img: '/img/bgMateriKimia.png',
    }, ],

    // Array 3
    [{
        title: "Bahasa Indonesia",
        description: "UM Master: Majas dan Peribahasa",
        isOnline: true,
        startTime: "09.00",
        endTime: "11.00",
        tutor: "Kak Ambar",
        tanggal: "Rabu, 22 Maret 2023",
        img: '/img/bgMateriIndo.png',
    }, {
        title: "IPS",
        description: "Pendalaman Materi: Sejarah Kerajaan Majapahit",
        isOnline: false,
        startTime: "11.00",
        endTime: "13.00",
        tutor: "Kak Triana",
        tanggal: "Rabu, 22 Maret 2023",
        img: '/img/bgMateriIPS.png',
    }, {
        title: "IPA",
        description: "Latihan Soal Fisika: Gerak Lurus",
        isOnline: true,
        startTime: "14.00",
        endTime: "16.00",
        tutor: "Kak Uswa",
        tanggal: "Rabu, 22 Maret 2023",
        img: '/img/bgMateriIPA.png',
    }, ],

    // Array 4
    [{
        title: "Kimia",
        description: "UM Master: Kimia: Termokimia",
        isOnline: true,
        startTime: "07.30",
        endTime: "09.30",
        tutor: "Kak Triana",
        tanggal: "Kamis, 23 Maret 2023",
        img: '/img/bgMateriKimia.png',
    }, {
        title: "Bahasa Inggris",
        description: "Kelas Kedinasan: Vocabulary Building",
        isOnline: true,
        startTime: "10.00",
        endTime: "12.00",
        tutor: "TA P",
        tanggal: "Kamis, 23 Maret 2023",
        img: '/img/bgMateriInggris.png',
    }, {
        title: "Bahasa Indonesia",
        description: "UM Master: Analisis Teks Berita",
        isOnline: false,
        startTime: "13.30",
        endTime: "15.30",
        tutor: "Kak Ambar",
        tanggal: "Kamis, 23 Maret 2023",
        img: '/img/bgMateriIndo.png',
    }, ],

    // Array 5
    [{
        title: "IPS",
        description: "UM Master: IPS: Latihan Soal Geografi",
        isOnline: true,
        startTime: "08.15",
        endTime: "10.15",
        tutor: "Kak Triana",
        tanggal: "Jumat, 24 Maret 2023",
        img: '/img/bgMateriIPS.png',
    }, {
        title: "IPA",
        description: "UM Master: IPA: Latihan Soal Ekosistem",
        isOnline: true,
        startTime: "11.00",
        endTime: "13.00",
        tutor: "Kak Uswa",
        tanggal: "Jumat, 24 Maret 2023",
        img: '/img/bgMateriIPA.png',
    }, {
        title: "Kimia",
        description: "Praktikum Virtual: Reaksi Asam Basa",
        isOnline: true,
        startTime: "14.00",
        endTime: "16.00",
        tutor: "Kak Triana",
        tanggal: "Jumat, 24 Maret 2023",
        img: '/img/bgMateriKimia.png',
    }, ],
];

    const [materi, setMateri] = useState(allMateri[0]);

    // fungsi untuk mengganti materi
    function gantiMateri(index) {
        setMateri(allMateri[index]);
    }

    return(
        <div className="w-screen">
            <Sidebar 
                className='absolute'
                hideSidebar={hideSidebar} 
                left={left} 
                bg={bg}
            >
                <BurgerMenu icon={menuIcon} handleClick={hideSidebar}/>
            </Sidebar>

            <Topbar>
                <BurgerMenu icon={menuIcon} handleClick={hideSidebar}/>
                <div></div>
            </Topbar>

            <div className="w-full  min-h-screen bg-[#F1F2F9] flex ">
                
                {/* aside */}
                <div className="w-60 shrink-0 p-4 flex flex-col gap-3">
                    <div className="flex gap-3 items-center cursor-pointer ">
                        <img src="/img/ruangKelas.png" alt="" className="w-8 h-9 pb-1"/>
                        <div className="p-3 w-full hover:bg-[#44aeb8] hover:text-white duration-150 transition-colors rounded-lg">Kelas</div>
                    </div>
                    <div className="flex gap-3 items-center cursor-pointer ">
                        <img src="/img/chat.png" alt="" className="w-8 h-9 pb-1"/>
                        <div className="p-3 w-full hover:bg-[#44aeb8] hover:text-white duration-150 transition-colors rounded-lg">Sesi Tutor</div>
                    </div>
                    <div className="flex gap-3 items-center cursor-pointer ">
                        <img src="/img/materi.png" alt="" className="w-8 h-9 pb-1"/>
                        <div className="p-3 w-full hover:bg-[#44aeb8] hover:text-white duration-150 transition-colors rounded-lg">Materi</div>
                    </div>
                    <div className="flex gap-3 items-center cursor-pointer ">
                        <img src="/img/videoBelajar.png" alt="" className="w-8 h-9 pb-1"/>
                        <div className="p-3 w-full hover:bg-[#44aeb8] hover:text-white duration-150 transition-colors rounded-lg">Video Belajar</div>
                    </div>
                </div>

                {/* main */}
                <div className="flex-1 min-w-0" >
                    
                    {/* sesi tersedia */}
                    <div className="w-full bg-white h-10 flex items-center ps-2"><span className="h-full px-2 border-b-3 flex items-center border-[#13939E] font-semibold">Sesi Tersedia</span></div>

                    {/* tanggal */}
                    <div className="flex-1 h-10 mt-5">
                        <div className="w-full overflow-x-scroll">
                            <div className="w-fit flex gap-2">
                                {dates.map((date, index) => (
                                    <div key={index} onClick={() => selectDate(index)} className={`${index >= 5 ? 'cursor-not-allowed border-white bg-white' : date.isSelected ? 'cursor-pointer border-[#2196F3] bg-[#d9ebfa]' : 'cursor-pointer hover:border-[#2196F3] hover:bg-[#d9ebfa] bg-white border-white'} w-25 h-15 flex flex-col items-center justify-center text-center rounded-lg border `}>
                                        <div className={`${index >= 5 ? 'text-gray-300' : 'text-black'} font-semibold`}>{date.date.toLocaleDateString('id-ID', { weekday: 'long'})} </div>
                                        <div className={`text-sm ${index >= 5 ? 'text-gray-300' : 'text-gray-500'}`}>{date.date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric'})} </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    {/* kelas tersedia */}
                    <div className="mt-20 pe-10 flex flex-wrap gap-8 mb-10 ms-10">
                    {/* <div className="mt-20 pe-10 grid grid-cols-3 gap-6 mb-10"> */}
                        {materi.map((materi) => (
                            <div key={materi.title} className="flex justify-center">
                                <div className="mb-4 w-80 h-auto rounded-2xl bg-white" style={{boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'}}>
                                    <img src={materi.img} alt="" className="w-full h-30"/>
                                    <div className="flex gap-2 p-2">
                                        <div className="bg-[#F3E4F6] border border-[#B14EC6] p-0.5 flex text-[#B14EC6] px-2 rounded-lg text-sm">
                                            <span className="me-1">
                                                <img src="/img/isOnline.svg" alt="" className="h-full"/>
                                            </span>
                                            {materi.isOnline ? 'Online' : 'Offline'}
                                        </div> 
                                    </div>
                                    <div className="ps-4 pb-1 text-sm text-gray-500 font-semibold">Regular Class</div>
                                    <div className="ps-4 pb-1 text-lg font-bold">{materi.description}</div>
                                    <div className="ps-4 text-sm text-gray-600 flex"><img src="/img/calendar.svg" alt="" className="pe-2" />{materi.tanggal}</div>
                                    <div className="ps-4 text-sm text-gray-600 flex"><img src="/img/clock.svg" alt="" className="pe-2" />{materi.startTime} - {materi.endTime}</div>
                                    <div className="ps-4 text-sm text-gray-600 flex"><img src="/img/teacher.svg" alt="" className="pe-2" />{materi.tutor}</div>
                                    <div className="p-4">
                                        <div className="w-full py-2 border-gray-300 border-[1.5px] rounded-full text-center font-semibold hover:bg-gray-100 transition-colors duration-150 cursor-pointer">Lihat detail</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    
                </div>

            </div>
        </div>
    );
}

export default RuangKelas;