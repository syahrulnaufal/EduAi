
import '../style.css'; 
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import BurgerMenu from "../components/BurgerMenu";
import MateriPageAsidebar from "../components/MateriPageAsidebar";
import { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router";


function MateriBelajarPage(){
    // Sidebar 
    const [left, setLeft] = useState('-left-70') 
    const [bg, setBg] = useState('bg-transparent -z-10')
    const [isSidebarHidden, setIsSidebarHidden] = useState(true)
    const iconSize = '20px'
    const menuButton = <svg xmlns="http://www.w3.org/2000/svg" id='menu' height={iconSize} viewBox="0 -960 960 960" width={iconSize} className="fill-my-text dark:fill-my-text-dark"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>
    const closeButton = <svg xmlns="http://www.w3.org/2000/svg" id='close' height={iconSize} viewBox="0 -960 960 960" width={iconSize} className="fill-my-text dark:fill-my-text-dark"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>;
    const [menuIcon, setMenuIcon] = useState(isSidebarHidden? menuButton : closeButton)

    // id materi
    const {id, materi } = useParams();
    const [data, setData] = useState(null);
    const [bab, setBab] = useState(null);
    const [selectedBab, setSelectedBab] = useState(materi||null);

    useEffect(() => {
        console.log("Mengirim request ke:", `http://localhost:5000/api/bab/bab-all?id_pelajaran=${id}`);
        fetch(`http://localhost:5000/api/bab/bab-all?id_pelajaran=${id}`)
        .then((res) => res.json())
        .then((result) => {
            console.log("HASIL FETCH API BAB:", result); // Tambahkan ini untuk cek response
            setBab(result);
        })
        .catch((err) => {
            console.error("Error fetch:", err);
        });
    }, [id]);

// ...existing code...
        useEffect(() => {
        const idBab = selectedBab || materi; // pilih yang ada dulu
        if (!idBab) return; // kalau dua-duanya null, jangan fetch

        const url = `http://localhost:5000/api/subbab?id_bab=${idBab}`;
        console.log("Mengirim request ke:", url);

        fetch(url)
            .then((res) => res.json())
            .then((result) => {
                if (result?.subbab && Array.isArray(result.subbab)) {
                    const sorted = [...result.subbab].sort((a, b) => (a.urutan ?? 0) - (b.urutan ?? 0));
                    result.subbab = sorted.map((s, i) => ({ ...s, isSelected: i === 0 }));
                }
                setData(result);
            })
            .catch((err) => {
                console.error("Error fetch:", err);
            });
    }, [selectedBab, materi]);

        

    //asidebar
    // const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [asidebarLeft, setAsidebarLeft] = useState('left-0');
    const [isAsidebarHidden, setIsAsidebarHidden] = useState(false);

    //function to hide/unhide the asidebar
    function toggleAsidebar() {
        if (asidebarLeft === '-left-90') {
            setAsidebarLeft('left-0');
            setIsAsidebarHidden(false);
        } else {
            setAsidebarLeft('-left-90');
            setIsAsidebarHidden(true);
        }
    }
    
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

    // data materi buat asidebar
    // const listMateri = [
    //     {
    //         "id": 1,
    //         "img": "/img/video1.png",
    //         "title": "Data Tunggal dan Data Kelompok beserta Penyajiannya",
    //         "description": "Ada data tunggal, ada data kelompok. Kita belajar cara penyajiannya yuk! Video ini video konsep kilat. Materi dijelaskan lebih cepat. Langsung aja yuk mulai belajar!",
    //         "kuis": {
    //             "title": "Kuis 1 Statistika",
    //             "xp": 50,
    //             "gold": 50
    //         },
    //         "xp": 125,
    //         "gold": 10,
    //         "listVideo": [
    //             {"title": "Pengertian dan Contoh Data Tunggal", "duration": "03:11", isSelected : false},
    //             {"title": "Pengertian dan Contoh Data Kelompok", "duration": "07:53", isSelected : false},
    //             {"title": "Penyajian Data Kelompok dengan Histogram", "duration": "11:43", isSelected : false},
    //             {"title": "Penyajian Data Kelompok dengan Grafik Poligon", "duration": "10:15", isSelected : false},
    //             {"title": "Penyajian data kelompok dengan ogive positif dan negatif", "duration": "09:56", isSelected : false},
    //             {"title": "Sudah paham tentang histogram dan mau soal yang lebih menantang?", "duration": "12:40", isSelected : false},
    //             {"title": "Kesimpulan data tunggal dan data kelompok serta penyajiannya", "duration": "13:20", isSelected : false},
    //             {"title": "Kuis 1 Statistika (Deskriptif)", "duration": " ", isSelected : true}
    //         ]
    //     },
    //     {
    //         "id": 2,
    //         "img": "/img/video2.png",
    //         "title": "Ukuran Pemusatan Data (Mean, Modus, Median)",
    //         "description": "Yuk, kita pelajari cara menemukan nilai pusat dari sebuah data! Dalam video konsep kilat ini, kamu akan belajar tentang Mean, Median, dan Modus dengan cepat dan mudah. Mari kita mulai!",
    //         "kuis": {
    //             "title": "Kuis 2 Statistika",
    //             "xp": 50,
    //             "gold": 50
    //         },
    //         "xp": 125,
    //         "gold": 10,
    //         "listVideo": [
    //             {"title": "Pengertian Ukuran Pemusatan Data", "duration": "04:15", isSelected : false},
    //             {"title": "Mencari Mean (Rata-Rata) pada Data Tunggal dan Kelompok", "duration": "08:30", isSelected : false},
    //             {"title": "Mencari Median (Nilai Tengah) pada Data Tunggal dan Kelompok", "duration": "09:55", isSelected : false},
    //             {"title": "Mencari Modus (Nilai yang Sering Muncul) pada Data Tunggal dan Kelompok", "duration": "07:40", isSelected : false},
    //             {"title": "Hubungan antara Mean, Median, dan Modus", "duration": "06:20", isSelected : false},
    //             {"title": "Latihan Soal Gabungan Mean, Median, dan Modus", "duration": "14:50", isSelected : false},
    //             {"title": "Kuis 2 Statistika (Ukuran Pemusatan)", "duration": " ", isSelected : false}
    //         ]
    //     },{
    //         "id": 3,
    //         "img": "/img/video1.png",
    //         "title": "Data Tunggal dan Data Kelompok beserta Penyajiannya",
    //         "description": "Ada data tunggal, ada data kelompok. Kita belajar cara penyajiannya yuk! Video ini video konsep kilat. Materi dijelaskan lebih cepat. Langsung aja yuk mulai belajar!",
    //         "kuis": {
    //             "title": "Kuis 1 Statistika",
    //             "xp": 50,
    //             "gold": 50
    //         },
    //         "xp": 125,
    //         "gold": 10,
    //         "listVideo": [
    //             {"title": "Pengertian dan Contoh Data Tunggal", "duration": "03:11", isSelected : false},
    //             {"title": "Pengertian dan Contoh Data Kelompok", "duration": "07:53", isSelected : false},
    //             {"title": "Penyajian Data Kelompok dengan Histogram", "duration": "11:43", isSelected : false},
    //             {"title": "Penyajian Data Kelompok dengan Grafik Poligon", "duration": "10:15", isSelected : false},
    //             {"title": "Penyajian data kelompok dengan ogive positif dan negatif", "duration": "09:56", isSelected : false},
    //             {"title": "Sudah paham tentang histogram dan mau soal yang lebih menantang?", "duration": "12:40", isSelected : false},
    //             {"title": "Kesimpulan data tunggal dan data kelompok serta penyajiannya", "duration": "13:20", isSelected : false},
    //             {"title": "Kuis 1 Statistika (Deskriptif)", "duration": " ", isSelected : false}
    //         ]
    //     },
    //     {
    //         "id": 4,
    //         "img": "/img/video2.png",
    //         "title": "Ukuran Pemusatan Data (Mean, Modus, Median)",
    //         "description": "Yuk, kita pelajari cara menemukan nilai pusat dari sebuah data! Dalam video konsep kilat ini, kamu akan belajar tentang Mean, Median, dan Modus dengan cepat dan mudah. Mari kita mulai!",
    //         "kuis": {
    //             "title": "Kuis 2 Statistika",
    //             "xp": 50,
    //             "gold": 50
    //         },
    //         "xp": 125,
    //         "gold": 10,
    //         "listVideo": [
    //             {"title": "Pengertian Ukuran Pemusatan Data", "duration": "04:15", isSelected : false},
    //             {"title": "Mencari Mean (Rata-Rata) pada Data Tunggal dan Kelompok", "duration": "08:30", isSelected : false},
    //             {"title": "Mencari Median (Nilai Tengah) pada Data Tunggal dan Kelompok", "duration": "09:55", isSelected : false},
    //             {"title": "Mencari Modus (Nilai yang Sering Muncul) pada Data Tunggal dan Kelompok", "duration": "07:40", isSelected : false},
    //             {"title": "Hubungan antara Mean, Median, dan Modus", "duration": "06:20", isSelected : false},
    //             {"title": "Latihan Soal Gabungan Mean, Median, dan Modus", "duration": "14:50", isSelected : false},
    //             {"title": "Kuis 2 Statistika (Ukuran Pemusatan)", "duration": " ", isSelected : false}
    //         ]
    //     },
    // ];

    // main content 
    // const [showedContent, setShowedContent] = useState(listMateri[0]);
    

    // function to change showedContent
    // function selectContent(index){
    //     setShowedContent(listMateri[index])
    // }

    // togle function to selected video or not
    function selectVideo(index){
        setData(prev => {
            if (!prev?.subbab) return prev;
            const newSubbab = prev.subbab.map((s, i) => ({ ...s, isSelected: i === index }));
            return { ...prev, subbab: newSubbab };
        });
   }
    

    return(
        <div className="flex">
            <Sidebar 
                className='absolute'
                hideSidebar={hideSidebar} 
                left={left} 
                bg={bg}
            >
                <BurgerMenu icon={menuIcon} handleClick={hideSidebar}/>
            </Sidebar>

            {/* Topbar */}
            <div className="fixed w-screen z-10">
                {/* topbar */}
                {/* <Topbar>
                    <BurgerMenu icon={menuIcon} handleClick={hideSidebar}/>
                </Topbar> */}

                {/* blue topbar  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;*/}
                <div className="w-screen bg-[#1C58B4] p-6" style={{boxShadow: "rgba(100, 100, 111, 0.3) 0px 7px 29px 0px"}}>
                    <div className="flex gap-3">
                        <div className="bg-white p-1 rounded-lg">
                            <img src="/img/ikonPetir.png" alt="" className="h-12"/>
                        </div>
                        <div className="text-white flex flex-col justify-center">
                            <div className="font-bold text-2xl">Konsep Kilat</div>
                            <div className="text-sm">Statistika Deskriptif ⚡</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* asidebar */}
            <div className={` h-screen ${asidebarLeft} transition-all duration-200 z-5 fixed w-fit`} >
                
                {/* close togle button  */}
                <div onClick={toggleAsidebar} className={` ${isAsidebarHidden ? '-right-20' : '-right-5'} top-35 z-10 absolute cursor-pointer p-2 rounded-full bg-white hover:bg-indigo-50 duration-150`}>
                    <img className={`${isAsidebarHidden ? '-rotate-90' : 'rotate-90'} transition-all duration-500`} src='/img/arrowDown.png' width={'20px'}/>
			    </div>

                <MateriPageAsidebar>
                    <div className="flex gap-4 flex-col p-4 mt-10 mb-20">
                        {/*
                          handle: data bisa berupa array (lama) atau object { bab, subbab } (API)
                          buat array uniform: kalau data adalah array pakai data, kalau object pakai data.subbab atau fallback []
                        */}
                        {(() => {
                            const asideItems = Array.isArray(bab) ? bab : (bab?.bab ?? []);
                            if (!asideItems || asideItems.length === 0) {
                                return <p className="text-center text-gray-500">Belum ada materi tersedia</p>;
                            }
                            return asideItems.map((materi, index) => {
                                const keyId = materi.id_subbab ?? materi.id_bab ?? `aside-${index}`;
                                const title = materi.judul_bab ?? materi.judul_subbab ?? 'Judul';
                                return (
                                    <div
                                        key={keyId}
                                        className="border border-[#025584] mt-20 w-[90%] active:ms-5 transition-all duration-150 ease-out cursor-pointer bg-white rounded-xl flex flex-col items-center relative"
                                        onClick={() => setSelectedBab(materi.id_bab)} 
                                    >
                                        <div className="w-[60%] absolute -top-20 ">
                                            <img src={materi.img || '/img/default.png'} alt="thumbnail" className="rounded-lg"/>
                                        </div>
                                        <div className="h-8 bg-[#025584] w-full rounded-t-lg "></div>
                                        <img src="/img/ikonAdapto.png" alt="" className="w-20 absolute top-5"/>
                                        <div className="px-2 text-center pt-5 pb-3">{title}</div>
                                        <div className="flex gap-3 pb-3">
                                            <div className="flex gap-2 items-center">
                                                <img src="/img/ikonXp.png" alt="XP" className="w-7"/>
                                                <div>{materi.point_xp ?? 0}</div>
                                            </div>
                                            <div className="flex gap-2 items-center">
                                                <img src="/img/ikonGold.png" alt="GOLD" className="w-7"/>
                                                <div>{materi.point_gold ?? 0}</div>
                                            </div>
                                        </div>
                                        <div className="p-2 w-full">
                                            <div className="border-gray-300 border rounded-lg p-2 flex gap-1 items-center justify-between hover:bg-gray-100 transition-colors duration-150">
                                                <img src="/img/ikonKuis.png" alt="" className="w-9 h-9"/>
                                                <div className="w-20 truncate">{title}</div>
                                                <div className="flex gap-1">
                                                    <div className="flex gap-1 items-center">
                                                        <img src="/img/ikonXp.png" alt="XP" className="w-7"/>
                                                        <div>{materi.point_xp ?? 0}</div>
                                                    </div>
                                                    <div className="flex gap-1 items-center">
                                                        <img src="/img/ikonGold.png" alt="GOLD" className="w-7"/>
                                                        <div>{materi.point_gold ?? 0}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            });
                        })()}
                    </div>
                </MateriPageAsidebar>
            </div>
            
            {/* video pembelajaran */}
            <div className={`w-screen h-screen bg-my-bg px-5 sm:px-20 lg:px-40 ${isAsidebarHidden ? 'ml-0' : window.innerWidth <= 768 ? 'ml-0' : 'ml-80'} transition-all duration-200`}>
                {/* close togle button  */}
                {/* <div onClick={toggleAsidebar} className={` ${isAsidebarHidden ? 'left-20' : '-left-5'} top-35 z-10 absolute cursor-pointer p-2 rounded-full bg-white hover:bg-indigo-50 duration-150`}>
                    <img className={`${isAsidebarHidden ? '-rotate-90' : 'rotate-90'} transition-all duration-500`} src='/img/arrowDown.png' width={'20px'}/>
			    </div> */}

                <div className="w-full min-h-full flex flex-col bg-surface">
                    <div className="h-30"></div>
                    {/* image  */}
                    <div className="w-full px-2">
                        <img src={data?.bab?.img||'/img/default.png'} alt="" className="w-full rounded-xl" />
                    </div>

                    {/* deskripsi  */}
                    <div className="mt-5 mb-1 font-bold text-xl px-4">{data?.bab?.judul_bab}</div>
                    <div className="px-4">{data?.bab?.detail}</div>

                    {/* timeline video */}
                    <div className="px-4 text-xl font-bold mt-5 mb-1">Timeline Video</div>
                    {data?.subbab
                        ?.sort((a, b) => a.urutan - b.urutan) // urutkan sesuai urutan
                        .map((video, index) => {
                            const keyId = video.id_subbab ?? video.id_bab ?? `sub-${index}`;
                             if (video.isSelected) {
                            return (
                                <div
                                className="px-4 py-2 text-white w-full"
                                key={keyId}
                                onClick={() => selectVideo(index)}
                                 >
                                <div className=" flex bg-[#5BA4F9] transition-all duration-150 cursor-pointer px-4 py-2 rounded-lg justify-between items-center mb-2 w-full">
                                    <div className="flex gap-2 items-center w-[90%]">
                                    <div className="bg-[#F3FFC6] w-15 h-10 rounded-md flex justify-center items-center">
                                        <img src="/img/ikonKuis.png" alt="" className="h-[90%]" />
                                    </div>
                                    <span className="max-w-[80%]">{video.judul_subbab}</span>
                                    </div>
                                    <div className="text-sm ">
                                    {video.duration ?? "00:00"}
                                    </div>
                                </div>
                                </div>
                            );
                            } else {
                            return (
                                <div
                                className="px-4 py-2"
                                key={keyId}
                                onClick={() => selectVideo(index)}
                                >
                                <div className=" flex bg-[#F1F4F9] hover:bg-[#e5ebf7] transition-all duration-150 cursor-pointer px-4 py-2 rounded-lg justify-between items-center mb-2">
                                    <div className="flex gap-2 items-center w-[90%]">
                                    <img src="/img/videoIkon.png" alt="" className="w-8" />
                                    <span className="truncate ">{video.judul_subbab}</span>
                                    </div>
                                    <div className="text-sm text-gray-500 ">
                                    {video.duration ?? "00:00"}
                                    </div>
                                </div>
                                </div>
                            );
                            }
                        })}


                    <div className="h-20"></div>

                </div>

            </div>

        </div>
    );
}

export default MateriBelajarPage;