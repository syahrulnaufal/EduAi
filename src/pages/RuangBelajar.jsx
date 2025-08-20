import React from "react";
import Topbar from "../components/Topbar";
import { useState, useEffect } from "react";
import { useDebounce } from "react-use";
import '../style.css';
import Sidebar from "../components/Sidebar";
import BurgerMenu from "../components/BurgerMenu";
import Search from "../components/Search";
import Select from 'react-select';
import { NavLink } from "react-router";

// data akun user
const user = {
    name: 'Syahrul',
}

// list materi belajar
const listMateri = [
    {
        id: 1,
        label: 'Bahasa Indonesia',
        ikon: '/img/ikonKelasBahasaIndo.png',
        link: 'indo' // link berdasarkan data di /data/kelas.json
    }, {
        id: 2,
        label: 'IPA Terpadu',
        ikon: '/img/ipa.png',
        link: 'fisika'
    }, {
        id: 3,
        label: 'Matematika',
        ikon: '/img/mtk.png',
        link: 'mtk'
    }, {
        id: 4,
        label: 'IPS Terpadu',
        ikon: '/img/ips.png',
        link: 'indo'
    }, {
        id: 5,
        label: 'Ruang Ngaji',
        ikon: '/img/ikonMengaji.png',
        link: 'indo'
    }, {
        id: 6,
        label: 'Tentang Edu AI',
        ikon: '/img/ikonUser.png',
        link: 'indo'
    }, {
        id: 7,
        label: 'Kimia',
        ikon: '/img/kimia.png',
        link: 'kimia'
    }, {
        id: 8,
        label: 'B. Inggris',
        ikon: '/img/inggris.png',
        link: 'inggris'
    }, 
].map((materi, index) => ({ ...materi, id: index + 1 }));

function RuangBelajar() {
    // Sidebar 
    const [left, setLeft] = useState('-left-70')
    const [bg, setBg] = useState('bg-transparent -z-10')
    const [isSidebarHidden, setIsSidebarHidden] = useState(true)
    const iconSize = '20px'
    const menuButton = <svg xmlns="http://www.w3.org/2000/svg" id='menu' height={iconSize} viewBox="0 -960 960 960" width={iconSize} className="fill-my-text dark:fill-my-text-dark"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" /></svg>
    const closeButton = <svg xmlns="http://www.w3.org/2000/svg" id='close' height={iconSize} viewBox="0 -960 960 960" width={iconSize} className="fill-my-text dark:fill-my-text-dark"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg>;
    const [menuIcon, setMenuIcon] = useState(isSidebarHidden ? menuButton : closeButton)

    // search
    const [debounceSearchTerm, setDebounceSearchTerm] = useState('')
    const [searchTerm, setSearchTerm] = useState('')

    // dropdown 
    const [selectedDropdown, setSelectedDropdown] = useState(null);
    const dropDownlist = [
        { value: 1, label: 'Kelas 1 ' },
        { value: 2, label: 'Kelas 2 ' },
        { value: 3, label: 'Kelas 3 ' },
        { value: 4, label: 'Kelas 4 ' },
        { value: 5, label: 'Kelas 5 ' },
        { value: 6, label: 'Kelas 6 ' },
        { value: 7, label: 'Kelas 7 ' },
        { value: 8, label: 'Kelas 8 ' },
        { value: 9, label: 'Kelas 9 ' },
        { value: 10, label: 'Kelas 10 ' },
        { value: 11, label: 'Kelas 11 ' },
        { value: 12, label: 'Kelas 12 ' },
        { value: 13, label: 'Kelas 10 SMK' },
        { value: 14, label: 'Kelas 11 SMK' },
        { value: 15, label: 'Kelas 12 SMK' },
        { value: 16, label: 'UTBK & Ujian Mandiri' },
        { value: 17, label: 'Mahasiswa dan Umum' },
        { value: 18, label: 'Orang tua' },
        { value: 19, label: 'Pelatihan Guru' },

    ];

    // handle onChange event of the dropdown
    const dropdown = e => {
        setSelectedDropdown(e);
    }

    // check change of seaerch term every 500ms
    useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm])
    // function run every search term change
    useEffect(() => {
        // function(debounceSearchTerm)
    }, [debounceSearchTerm])

    // Function to hide the sidebar
    function hideSidebar() {
        if (isSidebarHidden) {
            setLeft('left-0')
            setBg('bg-my-bg-dark/70 z-20')
            setIsSidebarHidden(false)
            setMenuIcon(closeButton)
        } else {
            setLeft('-left-70')
            setIsSidebarHidden(true)
            setBg('bg-transparent -z-10')
            setMenuIcon(menuButton)
        }
    }

    return (
        <div className="bg-my-bg relative w-screen h-screen">
            <Sidebar
                className='absolute'
                hideSidebar={hideSidebar}
                left={left}
                bg={bg}
            >
                <BurgerMenu icon={menuIcon} handleClick={hideSidebar} />
            </Sidebar>

            <Topbar>
                <BurgerMenu icon={menuIcon} handleClick={hideSidebar} />
                <div></div>
            </Topbar>

            {/* background gradasi biru hijau */}
            <div className="w-screen h-max bg-linear-90 from-[#52A9BC] to-[#7060D1] absolute z-1 text-white p-4 px-11 sm:px-21 pb-10 text-lg font-semibold rounded-b-2xl">
                Hi, {user.name} <br /><span className="text-base font-normal">Mau belajar apa hari ini ?</span>
            </div>

            {/* main */}
            <div className="w-screen px-5 sm:px-20 flex flex-col bg-transparent absolute pt-20 z-2">
                {/* search bar */}
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

                {/* list kelas */}
                <div className="w-full bg-white rounded-xl mt-5 p-5 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 2xl:grid-cols-12 gap-y-2 mb-20"
                    style={{ boxShadow: '0px 6px 20px 4px rgba(113, 130, 164, 0.10)' }}>
                    {listMateri.map((materi) =>
                        <NavLink key={materi.id} className="w-full" to={`/ruang-belajar/${materi.link}`} >
                            <div className="w-full flex justify-center">
                                <div className="p-0.5 hover:bg-gray-200 rounded-lg w-25 h-25 flex flex-col items-center justify-baseline gap-2 transition-colors duration-200 cursor-pointer select-none">
                                    <img src={materi.ikon} alt='ikon' className="w-[50%]" />
                                    <div className="text-sm text-center text-my-text">{materi.label}</div>
                                </div>
                            </div>
                        </NavLink>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RuangBelajar;