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
import MathCourse from "../components/MathCourse";
import LoginButton from "../components/LoginButton";

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

const eduChilOffer = (
    <div className="flex flex-col sm:flex-row items-center w-full px-10 sm:ps-20 sm:pe-10 justify-evenly relative overflow-hidden min-h-80 nunito-base">
        {/* text and button*/}
        <div className="flex flex-col max-w-150 gap-5 py-10 relative mt-15">
            <div className="text-5xl font-semibold">
                Edu Chil offers you a 30% discount this season
            </div>
            <div className="text-xl ps-1">
                Promotion valid from May 1, 2023 - June 30, 2023
            </div>
            {/* explore now button  */}
            <div className="px-8 py-2 mt-3 select-none cursor-pointer rounded-xl bg-indigo-400 hover:bg-indigo-600 active:bg-indigo-500 text-white text-2xl w-fit transition-colors duration-150">
                Explore Now
            </div>
            {/* bee */}
            <div className="absolute -z-1 w-15 sm:-left-15 sm:bottom-20 bottom-10 left-60">
                <img src="./img/bee.png" alt="" />
            </div>
        </div>

        {/* foto */}
        <div className="w-50 h-80 relative">
            <div className="w-120 absolute -bottom-40 sm:-bottom-50 -left-30">
                <img src="./img/littlegirlwithglasses.png" alt="littlegirlwithglasses" />
            </div>
        </div>

        {/* background png s*/}
        <div className="absolute -z-1 w-10 sm:bottom-10 bottom-50 sm:left-10 left-10">
            <img src="./img/spiral-left.png" alt="" />
        </div>
        <div className="absolute -z-1 w-10 sm:bottom-10 sm:right-100 lg:right-150 bottom-70 right-15" >
            <img src="./img/spiral-right.png" alt="" />
        </div>
        <div className="absolute -z-1 top-0 right-0 w-30">
            <img src="./img/flags.png" alt="" />
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
        const [options, setOptions] = useState([]);
          const [selected, setSelected] = useState(null);
        
          useEffect(() => {
            fetch("http://localhost:5000/api/jenjang")
              .then((res) => res.json())
              .then((data) => {
                const formatted = data.map((j) => ({
                  value: j.id_jenjang,
                  label: j.nama_jenjang,
                }));
                setOptions(formatted);
              })
              .catch((err) => console.error(err));
          }, []);



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
        <div className="bg-linear-180 from-white to-my-bg flex flex-col items-center w-screen box-border relative">
            {/* gradient ungu atas */}
            <img src="./img/bgGradient.webp" alt="Foto background" className="absolute z-1 w-screen" />

            {/* sidebar */}
            <Sidebar 
                hideSidebar={hideSidebar} 
                left={left} 
                bg={bg}
                >
                <BurgerMenu icon={menuIcon} handleClick={hideSidebar}/>
            </Sidebar>    

            {/* topbar */}
            <div className="z-2 w-screen">
                <Topbar>
                    <BurgerMenu icon={menuIcon} handleClick={hideSidebar}/>
                    <LoginButton onLogin={() => alert("Login button clicked!")} onSubscribe={() => alert("Subscribe button clicked!")}/>    
                </Topbar>
            </div>
            <div className="h-20"></div>

            {/* welcome text  */}
            <div className="z-2 w-screen flex flex-col items-center">
                {platformTerbaik}
                {welcomeText}
            </div>
            <div className="h-20"></div>

            {/* search bar and dropdown */}
            <div className="z-3 flex flex-col items-center w-[80%]">
                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} >
                    <div className="w-60">
                        <Select options={options} value={selected} onChange={setSelected} placeholder="Pilih Jenjang" />
                    </div>
                </Search>
            </div>
            <div className="h-20"></div>

            {/* wajah-wajah */}
            <div className="z-2 w-screen">
                {wajahWajah}
            </div>
            <div className="h-20"></div>

            {/* text "ruang belajar"  */}
            <div className="z-2 w-screen flex flex-col items-center">
                {ruangBelajarText}
            </div>
            <div className="h-20"></div>

            {/* pilih materi */}
            <div className="z-2 w-screen flex flex-col items-center">
                {pilihMateri}
            </div>
            <div className="h-10"></div>

            {/* fitur unggulan */}
            <div className="z-2 w-screen flex flex-col items-center">
                <FiturUnggulan />
            </div>
            <div className="h-20"></div>

            {/* fitur populer */}
            <FiturPopuler/>
            <div className="h-20"></div>

            {/* Edu chil offers  */}
            <div className="z-2 w-screen flex flex-col items-center bg-radial-[at_50%_-100%] from-amber-50 to-white ">
                {eduChilOffer}
            </div>
            
            {/* math course */}
            <div className="z-2 w-screen flex flex-col items-center bg-white py-10 pb-20">
                <MathCourse /> 
            </div>

            {/* footer */}
            <div className="z-2 w-screen flex flex-col items-center bg-white relative min-h-50 h-fit gap-5">
                <img src="./img/bgFooter.webp" alt="Foto background" className="absolute z-1 bg-cover bg-center w-full h-full" />
                {/* links  */}
                <div className="flex flex-col lg:flex-row flex-wrap w-full z-2 text-sm gap-10 leading-8 sm:leading-10">
                    <div className="px-5 flex-2 ">
                        <span className="font-bold">Corporate Head Office </span>: Jl. Prof. Dr. Hamka, Tambakaji, Kec. Ngaliyan, Kota Semarang, Jawa Tengah 50185 <br /><br />
                        <span className="font-bold">Phone</span> : <a href="https://wa.me/628973434055" target="_blank">08973434055</a> <br />
                        <span className="font-bold">Fax</span> : <a href="tel:02222264303">02-222264303</a> <br />
                        <span className="font-bold">Email</span> : <a href="mailto:syahrultsaqib@gmail.com">syahrultsaqib@gmail.com</a>
                    </div>
                    <div className="flex gap-10 flex-wrap lg:justify-between px-5 pe-10 flex-3 ">
                        <div className="min-w-30">
                            <span className="font-bold">Quick Links</span><br />
                            Pricing <br />
                            Jobs <br />
                            Employees <br />
                            Careers <br />
                            Contact Us <br />
                        </div>
                        <div className="min-w-30">
                            <span className="font-bold">Others</span><br />
                            How it Works <br />
                            Terms and Condition <br />
                            Privacy Policy <br />
                            About Us <br />
                        </div>
                        <div className="min-w-30">
                            <span className="font-bold">About Us</span><br />
                            Company milestone <br />
                            Web mail <br />
                            Board of Directors <br />
                            Senior Management <br />
                        </div>
                    </div>
                </div>
                {/* copyright and medsos  */}
                <div className="flex justify-between text-sm px-5 py-10 pe-10 w-screen z-2 ">
                    <div>© 2025  all right reserved</div>
                    <div className="flex gap-2">
                        <a href=""><img src="./img/ig.png" alt="" className="w-5" /></a>
                        <a href=""><img src="./img/tele.png" alt="" className="w-5" /></a>
                        <a href=""><img src="./img/tiktok.png" alt="" className="w-5" /></a>
                        <a href=""><img src="./img/yt.png" alt="" className="w-5" /></a>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Beranda;