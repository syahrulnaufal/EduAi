import React from "react";
import Topbar from "../components/Topbar";
import { useState, useEffect } from "react";
import { useDebounce } from "react-use";
import '../style.css'; 
import Sidebar from "../components/Sidebar";
import BurgerMenu from "../components/BurgerMenu";
import Search from "../components/Search";
import FiturUnggulan from "../components/FiturUnggulan";
import Select from 'react-select';
import { NavLink } from "react-router";
import FiturPopuler from "../components/FiturPopuler";

// komponen
const platformTerbaik = (
    <div className="bg-white rounded-xl flex p-1 px-4 sm:max-w-fit max-w-[200px]">
        <span className="me-2"><img className="w-[30px] sm:w-[20px]" src="/img/briefcase.png" alt="briefcase" /></span>
         #1 Platform Education Terbaik Berbasis AI
    </div>
);

const welcomeText = (
    <div className="text-center text-2xl sm:text-5xl font-bold mt-5 w-full px-5 sm:px-10">
        Platform Belajar Berbasis AI
        <br />
        untuk Siswa & Mahasiswa Cerdas
        <br />
        <div className="text-base font-normal mt-4">
            Tunjukkan Kemampuanmu, Bangun Masa Depanmu.
        </div>
    </div>
);

const itemWajah = [
    {
        id: 1,
        photo: './img/photoFrame1.png',
    },
    {
        id: 2,
        photo: './img/photoFrame2.png',
    },
    {
        id: 3,
        photo: './img/photoFrame3.png',
    },
    {
        id: 4,
        photo: './img/photoFrame4.png',
    },
    {
        id: 5,
        photo: './img/photoFrame5.png',
    },
    {
        id: 6,
        photo: './img/photoFrame1.png',
    },
    {
        id: 7,
        photo: './img/photoFrame2.png',
    },
    {
        id: 8,
        photo: './img/photoFrame3.png',
    },
    {
        id: 9,
        photo: './img/photoFrame4.png',
    },
    {
        id: 10,
        photo: './img/photoFrame5.png',
    },
];
const wajahWajah = (
    <div className="w-full px-4 overflow-x-scroll box-border">
        <div className="w-fit h-fit pb-1 flex gap-5">
            {itemWajah.map((photo) => 
                <div key={photo.id} className={`w-50 rounded-lg h-full `}>
                    <img src={photo.photo} alt="PhotoFrames" width={'200px'}/>
                </div>
            )}
        </div>
    </div>
);

// Ruang Belakar teks
const ruangBelajarText = (
    <div className="text-center text-2xl sm:text-5xl font-bold mt-5 w-full px-5 sm:px-10">
        Ruang Belajar
        <br />
        <div className="text-base font-normal mt-4">
            Belajar Sesuai Gayamu, Tampil Maksimal di Dunia Nyata
        </div>
    </div>
);

const listMateri = [
    {
        id: 1,
        img: './img/coc.png',
        label: 'Clash of Champions',
        link: '/'
    },
    {
        id: 2,
        img: './img/mtk.png',
        label: 'Matematika',
        link: '/'
    },
    {
        id: 3,
        img: './img/fisika.png',
        label: 'Fisika',
        link: '/'
    },
    {
        id: 4,
        img: './img/biologi.png',
        label: 'Biologi',
        link: '/'
    },
    {
        id: 5,
        img: './img/kimia.png',
        label: 'Kimia',
        link: '/'
    },
    {
        id: 6,
        img: './img/inggris.png',
        label: 'Bahasa Inggris',
        link: '/'
    },
    {
        id: 7,
        img: './img/indonesia.png',
        label: 'Bahasa Indonesia',
        link: '/'
    },
    {
        id: 8,
        img: './img/all.png',
        label: 'Semua Pelajaran',
        link: '/chatbot'
    },
]
const pilihMateri = (
    <div className="max-w-[90%] w-fit px-2 rounded-xl bg-white">
        <div className="overflow-x-auto overflow-y-hidden w-full">
            <div className="w-max p-3 flex flex-wrap gap-2 justify-start">
                {listMateri.map((materi) => 
                    <NavLink to={materi.link} key={materi.id}>
                        <div className="flex flex-col items-center sm:w-30 w-20 p-2 h-full rounded-lg hover:bg-indigo-50 active:bg-indigo-200 transition-colors duration-200" >
                            <img className="sm:w-[50px] w-[30px] rounded-xl" src={materi.img} alt={materi.label} />
                            <div className="mt-1 text-center sm:text-base text-sm">{materi.label}</div>
                        </div>
                    </NavLink>
                )}
            </div>
        </div>
    </div>
);

// main
function Beranda(){
    // Sidebar 
    const [left, setLeft] = useState('-left-70') 
    const [bg, setBg] = useState('bg-transparent -z-10')
    const [isSidebarHidden, setIsSidebarHidden] = useState(true)
    const iconSize = '20px'
    const menuButton = <svg xmlns="http://www.w3.org/2000/svg" id='menu' height={iconSize} viewBox="0 -960 960 960" width={iconSize} className="fill-my-text dark:fill-my-text-dark"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>
    const closeButton = <svg xmlns="http://www.w3.org/2000/svg" id='close' height={iconSize} viewBox="0 -960 960 960" width={iconSize} className="fill-my-text dark:fill-my-text-dark"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>;
    const [menuIcon, setMenuIcon] = useState(isSidebarHidden? menuButton : closeButton)
    
    // search
    const [debounceSearchTerm, setDebounceSearchTerm] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    
    // dropdown 
    const [selectedDropdown, setSelectedDropdown] = useState(null);
    const dropDownlist = [
        { value: 1, label: 'Kelas 10 - IPA - K13 Revisi' },
        { value: 2, label: 'Kelas 11 - IPA - K13 Revisi' },
        { value: 3, label: 'Kelas 12 - IPA - K13 Revisi' },
        { value: 4, label: 'Kelas 10 - IPS - K13 Revisi' },
        { value: 5, label: 'Kelas 11 - IPS - K13 Revisi' },
        { value: 6, label: 'Kelas 12 - IPS - K13 Revisi' },
    ];



    // Function to hide the sidebar
    function hideSidebar (){
        if(isSidebarHidden){
            setLeft('left-0')
            setBg('bg-my-bg-dark/70 z-20 blur-xl')
            setIsSidebarHidden(false)
            setMenuIcon(closeButton)
          }else{
            setLeft('-left-70')
            setIsSidebarHidden(true)
            setBg('bg-transparent -z-10')
            setMenuIcon(menuButton)
        }
    }
 
    // handle onChange event of the dropdown
    const dropdown = e => {
        setSelectedDropdown(e);
    }

    // check change of seaerch term every 500ms
    useDebounce(()=>setDebounceSearchTerm(searchTerm), 500,[searchTerm])
    // function run every search term change
    useEffect(()=>{
        // function(debounceSearchTerm)
    },[debounceSearchTerm])

    // html
    return(
        <div className="bg-my-bg flex flex-col items-center w-screen box-border ">
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
            
            <div className="h-20"></div>

            {platformTerbaik}

            {welcomeText}

            <div className="h-20"></div>

            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} >
                <div className="w-65">
                    <Select
                        options={dropDownlist}
                        value={selectedDropdown}
                        onChange={dropdown}
                        placeholder={dropDownlist[0].label}
                        />
                </div>
            </Search>

            <div className="h-20"></div>

            {wajahWajah}

            <div className="h-20"></div>

            {ruangBelajarText}

            <div className="h-20"></div>

            {pilihMateri}
        
            <div className="h-10"></div>

            <FiturUnggulan />

            <div className="h-20"></div>

            <FiturPopuler/>
            

            <div className="h-30"></div>

        </div>
    );
}

export default Beranda;