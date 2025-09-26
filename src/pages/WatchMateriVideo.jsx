import '../style.css'; 
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import BurgerMenu from "../components/BurgerMenu";
import MateriPageAsidebar from "../components/MateriPageAsidebar";
import { useState, useEffect } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";


function WatchMateriVideo(){
    //navigasi
    const navigate = useNavigate();

    // Sidebar state
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

    // ... useEffect hooks Anda (tidak ada perubahan) ...
    useEffect(() => {
        console.log("Mengirim request ke:", `http://localhost:5000/api/bab/bab-all?id_pelajaran=${id}`);
        fetch(`http://localhost:5000/api/bab/bab-all?id_pelajaran=${id}`)
        .then((res) => res.json())
        .then((result) => {
            console.log("HASIL FETCH API BAB:", result);
            setBab(result);
        })
        .catch((err) => {
            console.error("Error fetch:", err);
        });
    }, [id]);

    useEffect(() => {
        const idBab = selectedBab || materi;
        if (!idBab) return;

        const url = `http://localhost:5000/api/subbab?id_bab=${idBab}`;
        console.log("Mengirim request ke:", url);

        fetch(url)
            .then((res) => res.json())
            .then((result) => {
                if (result?.subbab && Array.isArray(result.subbab)) {
                    const sorted = [...result.subbab].sort((a, b) => (a.urutan ?? 0) - (b.urutan ?? 0));
                    const lastItemIsQuiz = sorted[sorted.length - 1]?.judul_subbab.toLowerCase().includes('kuis');
                    result.subbab = sorted.map((s, i) => ({ 
                        ...s, 
                        isSelected: lastItemIsQuiz ? i === sorted.length - 1 : i === 0 
                    }));
                }
                setData(result);
            })
            .catch((err) => {
                console.error("Error fetch:", err);
            });
    }, [selectedBab, materi]);

    //asidebar
    const [asidebarLeft, setAsidebarLeft] = useState('left-0');
    const [isAsidebarHidden, setIsAsidebarHidden] = useState(false);

    function toggleAsidebar() {
        if (asidebarLeft === '-left-90') {
            setAsidebarLeft('left-0');
            setIsAsidebarHidden(false);
        } else {
            setAsidebarLeft('-left-90');
            setIsAsidebarHidden(true);
        }
    }
    
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

    function selectVideo(index, id_subbab){
        setData(prev => {
            if (!prev?.subbab) return prev;
            const newSubbab = prev.subbab.map((s, i) => ({ ...s, isSelected: i === index }));
            return { ...prev, subbab: newSubbab };
        });
    }
    
    // ✅ Dapatkan detail video yang sedang aktif/terpilih
    const selectedVideo = data?.subbab?.find(video => video.isSelected);

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

            <div className="fixed w-screen z-10">
                <div className="w-screen bg-[#1C58B4] p-6" style={{boxShadow: "rgba(100, 100, 111, 0.3) 0px 7px 29px 0px"}}>
                    <div className="flex gap-3">
                        <div className="bg-white p-1 rounded-lg">
                            <img src="/img/ikonPetir.png" alt="" className="h-12"/>
                        </div>
                        <div className="text-white flex flex-col justify-center">
                            <div className="font-bold text-2xl">{data?.bab?.judul_bab}</div>
                            <div className="text-sm">Statistika Deskriptif ⚡</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={` h-screen ${asidebarLeft} transition-all duration-200 z-5 fixed w-fit`} >
                <div onClick={toggleAsidebar} className={` ${isAsidebarHidden ? '-right-20' : '-right-5'} top-35 z-10 absolute cursor-pointer p-2 rounded-full bg-white hover:bg-indigo-50 duration-150`}>
                    <img className={`${isAsidebarHidden ? '-rotate-90' : 'rotate-90'} transition-all duration-500`} src='/img/arrowDown.png' width={'20px'}/>
                </div>

                <MateriPageAsidebar>
                    <div className='min-h-full mt-8'>
                    {data?.subbab
                        ?.sort((a, b) => a.urutan - b.urutan)
                        .map((video, index) => {
                            const keyId = video.id_subbab ?? `sub-${index}`;
                            if (video.isSelected) {
                                return (
                                    <div className="px-4 py-2 text-white w-full" key={keyId} onClick={() => selectVideo(index, video.id_subbab)}>
                                        <div className=" flex bg-[#5BA4F9] transition-all duration-150 cursor-pointer px-4 py-2 rounded-lg justify-between items-center mb-2 w-full">
                                            <div className="flex gap-2 items-center w-[90%]">
                                                <div className="bg-[#F3FFC6] w-15 h-10 rounded-md flex justify-center items-center">
                                                    <img src="/img/ikonKuis.png" alt="" className="h-[90%]" />
                                                </div>
                                                <span className="max-w-[80%]">{video.judul_subbab}</span>
                                            </div>
                                            <div className="text-sm ">{video.duration ?? "00:00"}</div>
                                        </div>
                                    </div>
                                );
                            } else {
                                return (
                                    <div className="px-4 py-2" key={keyId} onClick={() => selectVideo(index, video.id_subbab)}>
                                        <div className=" flex bg-[#F1F4F9] hover:bg-[#e5ebf7] transition-all duration-150 cursor-pointer px-4 py-2 rounded-lg justify-between items-center mb-2">
                                            <div className="flex gap-2 items-center w-[85%]">
                                                <img src="/img/videoIkon.png" alt="" className="w-8" />
                                                <span className="truncate max-w-[80%]">{video.judul_subbab}</span>
                                            </div>
                                            <div className="text-sm text-gray-500 ">{video.duration ?? "00:00"}</div>
                                        </div>
                                    </div>
                                );
                            }
                        })}
                    </div>
                </MateriPageAsidebar>
            </div>
            
            <div className={`w-screen h-screen bg-my-bg px-5 sm:px-20 lg:px-40 ${isAsidebarHidden ? 'ml-0' : window.innerWidth <= 768 ? 'ml-0' : 'ml-80'} transition-all duration-200`}>
                <div className="w-full min-h-full flex flex-col bg-surface">
                    <div className="h-40"></div>
                    
                    {/* ✅ VIDEO PLAYER DITAMBAHKAN DI SINI */}
                    <div className="w-full px-4 mb-6">
                        {selectedVideo && selectedVideo.video_materi ? (
                            <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg">
                                <iframe
                                    src={`https://www.youtube.com/embed/${selectedVideo.video_materi}`}
                                    title={selectedVideo.judul_subbab}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full"
                                ></iframe>
                            </div>
                        ) : (
                            <div className="aspect-w-16 aspect-h-9 w-full rounded-xl bg-gray-200 flex items-center justify-center">
                                <p className="text-gray-500">Pilih video untuk ditonton atau video tidak tersedia</p>
                            </div>
                        )}
                    </div>

                    {/* deskripsi */}
                    <div className="px-4 font-bold text-xl mb-2">{selectedVideo?.judul_subbab}</div>
                    <div className="px-4">{data?.bab?.detail}</div>
                    
                    <div className="h-20"></div>
                </div>
            </div>
        </div>
    );
}

export default WatchMateriVideo;