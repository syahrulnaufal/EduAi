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
// import React, { useEffect, useState } from 'react';



// data akun user
// const user = {
//     name: 'Syahrul',
// }


// const listMateri = [
//     {
//         id: 1,
//         label: 'Bahasa Indonesia',
//         ikon: '/img/ikonKelasBahasaIndo.png',
//         link: 'indo' // link berdasarkan data di /data/kelas.json
//     }, {
//         id: 2,
//         label: 'IPA Terpadu',
//         ikon: '/img/ipa.png',
//         link: 'indo'
//     }, {
//         id: 3,
//         label: 'Matematika',
//         ikon: '/img/mtk.png',
//         link: 'mtk'
//     }, {
//         id: 4,
//         label: 'IPS Terpadu',
//         ikon: '/img/ips.png',
//         link: 'indo'
//     }, {
//         id: 5,
//         label: 'Ruang Ngaji',
//         ikon: '/img/ikonMengaji.png',
//         link: 'indo'
//     }, {
//         id: 6,
//         label: 'Tentang Edu AI',
//         ikon: '/img/ikonUser.png',
//         link: 'indo'
//     }, {
//         id: 7,
//         label: 'Bahasa Indonesia',
//         ikon: '/img/ikonKelasBahasaIndo.png',
//         link: 'indo'
//     }, {
//         id: 8,
//         label: 'IPA Terpadu',
//         ikon: '/img/ipa.png',
//         link: 'indo'
//     }, {
//         id: 9,
//         label: 'Matematika',
//         ikon: '/img/mtk.png',
//         link: 'mtk'
//     }, {
//         id: 10,
//         label: 'IPS Terpadu',
//         ikon: '/img/ips.png',
//         link: 'indo'
//     }, {
//         id: 11,
//         label: 'Ruang Ngaji',
//         ikon: '/img/ikonMengaji.png',
//         link: 'indo'
//     }, {
//         id: 12,
//         label: 'Tentang Edu AI',
//         ikon: '/img/ikonUser.png',
//         link: 'indo'
//     }, {
//         id: 13,
//         label: 'Bahasa Indonesia',
//         ikon: '/img/ikonKelasBahasaIndo.png',
//         link: 'indo'
//     }, {
//         id: 14,
//         label: 'IPA Terpadu',
//         ikon: '/img/ipa.png',
//         link: 'indo'
//     }, {
//         id: 15,
//         label: 'Matematika',
//         ikon: '/img/mtk.png',
//         link: 'mtk'
//     }, {
//         id: 16,
//         label: 'IPS Terpadu',
//         ikon: '/img/ips.png',
//         link: 'indo'
//     }, {
//         id: 17,
//         label: 'Ruang Ngaji',
//         ikon: '/img/ikonMengaji.png',
//         link: 'indo'
//     }, {
//         id: 18,
//         label: 'Tentang Edu AI',
//         ikon: '/img/ikonUser.png',
//         link: 'indo'
//     },
// ].map((materi, index) => ({ ...materi, id: index + 1 }));

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
    const [options, setOptions] = useState([]);
    const [selected, setSelected] = useState(null);
  // materi state
    const [listMateri, setListMateri] = useState([]);
    const [user, setUser] = useState("hi");

    const filteredMateri = listMateri.filter(materi =>
        materi.label.toLowerCase().includes(debounceSearchTerm.toLowerCase())
    );

  useEffect(() => {
    fetch("http://localhost:5000/api/jenjang")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((j) => ({
          value: j.id_jenjang,
          label: j.nama_jenjang,
        }));
        setOptions(formatted);
        // Cari opsi default dari data yang sudah diformat
        const defaultOption = formatted.find(
          (option) => option.label === 'Kelas 10 MA/SMA/SMK'
        );

        // Jika ditemukan, atur sebagai state 'selected'
        if (defaultOption) {
          setSelected(defaultOption);
        }
      })
      .catch((err) => console.error(err));
    }, []);

   useEffect(() => {
        if (selected) {
            fetch(`http://localhost:5000/api/materi?jenjang=${selected.value}`)
                .then(res => res.json())
                .then(data => setListMateri(data))
                .catch(err => setListMateri([]));
            console.log(listMateri)
        } else {
            setListMateri([]);
        }
    }, [selected]);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        console.log("User dari localStorage:", user);
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);


    // Debounce search
    useDebounce(() => setDebounceSearchTerm(searchTerm), 100, [searchTerm]);


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

    const iconMap = {
        Matematika: "/img/mtk.png",
        "Bahasa Indonesia": "/img/ikonKelasBahasaIndo.png",
        IPA: "/img/ipa.png",
        IPS: "/img/ips.png",
        default: "/img/default.png"
    };
        

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
                Hi, {user.username || user.name} <br /><span className="text-base font-normal">Mau belajar apa hari ini ?</span>
            </div>

            {/* main */}
            <div className="w-screen px-5 sm:px-20 flex flex-col bg-transparent absolute pt-20 z-2">
                {/* search bar */}
                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} >
                    <div className="w-65">
                        <Select defaultValue={'Kelas 10 MA/SMA/SMK'} options={options} value={selected} onChange={setSelected} placeholder="Pilih Jenjang" />
                    </div>
                </Search>

                {/* list kelas */}
                <div className="w-full bg-white rounded-xl mt-5 p-5 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 2xl:grid-cols-12 gap-y-2 mb-20"
                    style={{ boxShadow: '0px 6px 20px 4px rgba(113, 130, 164, 0.10)' }}>
                    {filteredMateri.length === 0 && (
                        <div className="col-span-full text-center text-gray-500 py-10">
                            {debounceSearchTerm
                                ? `Tidak ada hasil untuk "${debounceSearchTerm}".`
                                : (selected ? "Tidak ada materi untuk jenjang ini." : "Silakan pilih jenjang terlebih dahulu.")
                            }
                        </div>
                    )}
                    {filteredMateri.map((materi) => {
                        const ikonSrc = materi.ikon || iconMap[materi.label] || iconMap.default;
                        return (
                        <NavLink key={materi.id} className="w-full" to={`/ruang-belajar/${materi.id}`} >
                            <div className="w-full flex justify-center">
                                <div className="p-0.5 hover:bg-gray-200 rounded-lg w-25 h-25 flex flex-col items-center justify-baseline gap-2 transition-colors duration-200 cursor-pointer select-none">
                                    <img src={ikonSrc} alt='ikon' className="w-[50%]" />
                                    <div className="text-sm text-center text-my-text">{materi.label}</div>
                                </div>
                            </div>
                        </NavLink>
                    );
                    })}
                </div>
            </div>
        </div>
    );
}
  


export default RuangBelajar;