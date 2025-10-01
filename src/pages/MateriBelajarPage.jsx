import '../style.css'; 
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import BurgerMenu from "../components/BurgerMenu";
import MateriPageAsidebar from "../components/MateriPageAsidebar";
import { useState, useEffect } from "react";
import { NavLink, useParams, useNavigate } from "react-router";


function MateriBelajarPage(){
    //navigasi
    const navigate = useNavigate();

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
    const user = JSON.parse(localStorage.getItem("user"));
    const id_user = user?.id;
    const [hasilMap, setHasilMap] = useState({});



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
                    // Tandai item terakhir sebagai 'isSelected' jika itu kuis, atau item pertama jika bukan.
                    // Logika ini bisa disesuaikan dengan kebutuhan Anda.
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
 useEffect(() => {
  if (!id_user || !bab) return;

  const asideItems = Array.isArray(bab) ? bab : (bab?.bab ?? []);

  asideItems.forEach(materi => {
    const quizId = materi.quiz?.[0]?.id_quiz;   // ambil id_quiz dari materi
    if (!quizId) return;

    fetch("http://localhost:5000/api/bab/check-hasil", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_user, id_quiz: quizId })
    })
      .then(res => res.json())
      .then(data => {
        setHasilMap(prev => ({
          ...prev,
          [quizId]: data   // simpan hasil quiz tertentu ke hasilMap
        }));
      })
      .catch(err => console.error("Error cek hasil:", err));
  });
}, [id_user, bab]);



    // handle klik quiz pakai Swal
  const handleQuizClick = (quizId, namaQuiz) => {
  fetch("http://localhost:5000/api/bab/check-hasil", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_user, id_quiz: quizId })
  })
    .then(res => res.json())
    .then(data => {
      if (!data) {
        // belum pernah kerjakan → buat baru
        fetch("http://localhost:5000/api/soal/hasil/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_user, id_quiz: quizId })
        })
          .then(res => res.json())
          .then(newData => {
            navigate(`/exam/${quizId}?id_hasil=${newData.id_hasil}`);
          });
      } else if (!data.selesai) {
        // quiz belum selesai → lanjutkan
        Swal.fire({
          title: "Lanjutkan Quiz?",
          text: `${namaQuiz} belum selesai, mau lanjutkan?`,
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Ya, lanjutkan",
          cancelButtonText: "Batal"
        }).then(result => {
          if (result.isConfirmed) {
            navigate(`/exam/${quizId}?id_hasil=${data.id_hasil}`);
          }
        });
      } else {
        // quiz sudah selesai → tawarkan ulang
        Swal.fire({
          title: "Sudah pernah mengerjakan",
          text: `Skor sebelumnya: ${data.score}. Ulangi ${namaQuiz}?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Ya, ulangi",
          cancelButtonText: "Batal"
        }).then(result => {
          if (result.isConfirmed) {
            fetch("http://localhost:5000/api/soal/hasil/start", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id_user, id_quiz: quizId, ulang: true })
            })
              .then(res => res.json())
              .then(newData => {
                navigate(`/exam/${quizId}?id_hasil=${newData.id_hasil}`);
              });
          }
        });
      }
    });
};


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
        const clickedVideo = data?.subbab?.[index];

        // JIKA item yang diklik SUDAH memiliki isSelected: true, MAKA navigasi
        if (clickedVideo && clickedVideo.isSelected) {
            // Ganti '/kuis/' dengan path halaman tujuan Anda
            console.log(`Navigasi ke kuis dengan id_subbab: ${id_subbab}`);
            navigate(`/ruang-belajar/${id}/${materi}/${id_subbab}`); 
            return; // Hentikan fungsi
        }

        // JIKA tidak, cukup ubah item mana yang terpilih
        setData(prev => {
            if (!prev?.subbab) return prev;
            const newSubbab = prev.subbab.map((s, i) => ({ ...s, isSelected: i === index }));
            return { ...prev, subbab: newSubbab };
        });
    }
    // bikin array gambar
   const images = ["/img/video1.png", "/img/video2.png"];
    

    return(
        <div className="flex">
            {/* ...sisa JSX Anda yang tidak berubah... */}
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
                            <div className="font-bold text-2xl">Konsep Kilat</div>
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
                    <div className="flex gap-4 flex-col p-4 mt-10 mb-20">
                        {(() => {
                            const asideItems = Array.isArray(bab) ? bab : (bab?.bab ?? []);
                            if (!asideItems || asideItems.length === 0) {
                                return <p className="text-center text-gray-500">Belum ada materi tersedia</p>;
                            }
                            return asideItems.map((materi, index) => {
                                const keyId = materi.id_subbab ?? materi.id_bab ?? `aside-${index}`;
                                const title = materi.judul_bab ?? materi.judul_subbab ?? 'Judul';
                                // Pilih random image untuk setiap item
                                const randomImg = images[Math.floor(Math.random() * images.length)];
                                return (
                                    <div
                                        key={keyId}
                                        className="border border-[#025584] mt-20 w-[90%] active:ms-5 transition-all duration-150 ease-out cursor-pointer bg-white rounded-xl flex flex-col items-center relative"
                                        onClick={() => setSelectedBab(materi.id_bab)} 
                                    >
                                        <div className="w-[60%] absolute -top-20 "> <img src={materi.img || randomImg} alt="thumbnail" className="rounded-lg"/></div>
                                        <div className="h-8 bg-[#025584] w-full rounded-t-lg "></div>
                                        <img src="/img/ikonAdapto.png" alt="" className="w-20 absolute top-5"/>
                                        <div className="px-2 text-center pt-5 pb-3">{title}</div>
                                        <div className="flex gap-3 pb-3">
                                            <div className="flex gap-2 items-center"><img src="/img/ikonXp.png" alt="XP" className="w-7"/><div>{materi.point_xp ?? 0}</div></div>
                                            <div className="flex gap-2 items-center"><img src="/img/ikonGold.png" alt="GOLD" className="w-7"/><div>{materi.point_gold ?? 0}</div></div>
                                        </div>
                                        <div className="p-2 w-full">
                                            {materi.quiz && materi.quiz.length > 0 ? (
                                        <button
                                            className="border-gray-300 border rounded-lg p-2 flex gap-1 items-center justify-between hover:bg-gray-100 transition-colors duration-150"
                                            onClick={() => handleQuizClick(materi.quiz[0].id_quiz, materi.quiz[0].nama_quiz)}
                                        >
                                            <img src="/img/ikonKuis.png" alt="" className="w-9 h-9" />
                                            <div className="w-20 truncate">{materi.quiz[0].nama_quiz}</div>

                                            <div className="flex gap-1">
                                            {hasilMap[materi.quiz[0].id_quiz]?.id_hasil ? (
                                                <span className="text-green-600 font-bold">
                                                Score: {hasilMap[materi.quiz[0].id_quiz].score}
                                                </span>
                                            ) : (
                                                <>
                                                <div className="flex gap-1 items-center">
                                                    <img src="/img/ikonXp.png" alt="XP" className="w-7" />
                                                    <div>{materi.point_xp ?? 0}</div>
                                                </div>
                                                <div className="flex gap-1 items-center">
                                                    <img src="/img/ikonGold.png" alt="GOLD" className="w-7" />
                                                    <div>{materi.point_gold ?? 0}</div>
                                                </div>
                                                </>
                                            )}
                                            </div>
                                        </button>
                                        ) : (
                                        <div className="border border-gray-300 rounded-lg p-2 text-center text-gray-500">
                                            Belum ada quiz
                                        </div>
                                        )}
                                        </div>
                                    </div>
                                );
                            });
                        })()}
                    </div>
                </MateriPageAsidebar>
            </div>
            
            <div className={`w-screen h-screen bg-my-bg px-5 sm:px-20 lg:px-40 ${isAsidebarHidden ? 'ml-0' : window.innerWidth <= 768 ? 'ml-0' : 'ml-80'} transition-all duration-200`}>
                <div className="w-full min-h-full flex flex-col bg-surface">
                    <div className="h-30"></div>
                    <div className="w-full px-2"><img src={data?.bab?.img||'/img/default.png'} alt="" className="w-full rounded-xl" /></div>
                    <div className="mt-5 mb-1 font-bold text-xl px-4">{data?.bab?.judul_bab}</div>
                    <div className="px-4">{data?.bab?.detail}</div>
                    <div className="px-4 text-xl font-bold mt-5 mb-1">Timeline Video</div>
                    {data?.subbab
                        ?.sort((a, b) => a.urutan - b.urutan)
                        .map((video, index) => {
                            const keyId = video.id_subbab ?? `sub-${index}`;
                             if (video.isSelected) {
                            return (
                                <div
                                    className="px-4 py-2 text-white w-full"
                                    key={keyId}
                                    onClick={() => selectVideo(index, video.id_subbab)}
                                >
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
                                <div
                                    className="px-4 py-2"
                                    key={keyId}
                                    onClick={() => selectVideo(index, video.id_subbab)}
                                >
                                    <div className=" flex bg-[#F1F4F9] hover:bg-[#e5ebf7] transition-all duration-150 cursor-pointer px-4 py-2 rounded-lg justify-between items-center mb-2">
                                        <div className="flex gap-2 items-center w-[90%]">
                                            <img src="/img/videoIkon.png" alt="" className="w-8" />
                                            <span className="truncate ">{video.judul_subbab}</span>
                                        </div>
                                        <div className="text-sm text-gray-500 ">{video.duration ?? "00:00"}</div>
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