import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import BurgerMenu from "../components/BurgerMenu";
import { useState, useEffect } from "react";
import { useDebounce } from "react-use";
import { NavLink, useParams } from "react-router";
// import kelas from "../data/kelas"

const Search = ({searchTerm, setSearchTerm}) => {

    return(
        <div className="search rounded-xl p-4 shadow-sm flex flex-col sm:flex-row w-80">
            <div className="relative flex items-center flex-1 bg-white rounded-full">

                <img className="absolute left-2" src="/img/search_icon.png" alt="search" width={'25px'} />
                
                <input
                    // ref={refToUse}
                    className='flex-1 rounded-full px-4 ps-10 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors duration-300 
                            dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400
                            text-my-text placeholder-gray-400 border-gray-200 focus:border-indigo-300 shadow-sm
                            border '
                    type="text"
                    placeholder="Coba cari materi belajarmu disini..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
    )
}

function RuangMateri({}){

    // Sidebar 
    const [left, setLeft] = useState('-left-70') 
    const [bg, setBg] = useState('bg-transparent -z-10')
    const [isSidebarHidden, setIsSidebarHidden] = useState(true)
    const iconSize = '20px'
    const menuButton = <svg xmlns="http://www.w3.org/2000/svg" id='menu' height={iconSize} viewBox="0 -960 960 960" width={iconSize} className="fill-my-text dark:fill-my-text-dark"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>
    const closeButton = <svg xmlns="http://www.w3.org/2000/svg" id='close' height={iconSize} viewBox="0 -960 960 960" width={iconSize} className="fill-my-text dark:fill-my-text-dark"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>;
    const [menuIcon, setMenuIcon] = useState(isSidebarHidden? menuButton : closeButton);

    // search
    const [debounceSearchTerm, setDebounceSearchTerm] = useState('')
    const [searchTerm, setSearchTerm] = useState('')

    // parameter
    // const param = useParams();
    // const id = param.kelas ;
    const { id } = useParams(); // dapetin id dari URL
    console.log("ID dari URL:", id);
    const [data, setData] = useState(null);

    useEffect(() => {
        console.log("Mengirim request ke:", `http://localhost:5000/api/bab/bab-progres?id_pelajaran=${id}`);
        fetch(`http://localhost:5000/api/bab/bab-progres?id_pelajaran=${id}`)
        .then((res) => res.json())
        .then((result) => {
            console.log("HASIL FETCH API BAB:", result); // Tambahkan ini untuk cek response
            setData(result);
        })
        .catch((err) => {
            console.error("Error fetch:", err);
        });
    }, [id]);


    // tema
    // ...existing code...
const listTema = {
  "Matematika": {
    bg: "bg-blue-400",
    hoverBorder: "hover:border-blue-400",
  },
  "Bahasa Indonesia": {
    bg: "bg-indoRed",
    hoverBorder: "hover:border-indoRed",
  },
  "IPA Terpadu": {
    bg: "bg-green-400",
    hoverBorder: "hover:border-green-400",
  },
  // Tambahkan sesuai nama_pelajaran lain jika ada
};

// default tema awal
const defaultTema = {
  bg: "bg-blue-400",
  hoverBorder: "hover:border-blue-400",
};

const [tema, setTema] = useState(defaultTema);

useEffect(() => {
  if (!data || !data.nama_pelajaran) return;

  // ambil tema sesuai pelajaran, kalau tidak ada pakai default
  const temaBaru = listTema[data.nama_pelajaran] || defaultTema;
  setTema(temaBaru);
}, [data]);

// ...existing code...
    
    // data materi 
    // const listSubbab = kelas[id].data;
    // const ikon = kelas[id].ikon;
    // const title = kelas[id].title;

    // check change of seaerch term every 500ms
    useDebounce(()=>setDebounceSearchTerm(searchTerm), 500,[searchTerm])
    // function run every search term change
    useEffect(()=>{
        // function(debounceSearchTerm)
    },[debounceSearchTerm])

    // function for hiding sidebar
    function hideSidebar (){
        if(isSidebarHidden){
            setLeft('left-0')
            setBg('bg-my-bg-dark/70 z-20 ')
            setIsSidebarHidden(false)
            setMenuIcon(closeButton)
          }else{
            setLeft('-left-70')
            setIsSidebarHidden(true)
            setBg('bg-transparent -z-10')
            setMenuIcon(menuButton)
        }
    }
    // gabungkan progres dengan bab
  const babWithProgress = (data?.bab || []).map((b) => {
  return {
    ...b,
    total_subbab: b.progres?.total || 0,
    selesai: b.progres?.selesai || 0,
    progres: b.progres?.persen || 0, // default 0 kalau belum ada progres
  };
});

    // filter subbab gratis
    
return(
    <div className="w-screen text-sm bg-my-bg relative">
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

        {/* topbar merah */}
        <div className={`flex sm:flex-row flex-col justify-between px-4 items-center text-white ${listTema[data?.nama_pelajaran]?.bg || "bg-blue-400"}`} >
            <div className="flex gap-2 items-center mt-4 sm:mt-0 w-full sm:w-fit">
                <img
                  src={data?.icon_pelajaran ? data.icon_pelajaran : "/img/default.png"}
                  alt="icon"
                  className="w-10 p-0.5 rounded-lg bg-white"
                />
                <div className="pb-2 text-lg ">{data ? data.nama_pelajaran : <span className="text-gray-400">Loading...</span>}
                </div>
            </div>
            
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        </div>

        {/* AI Soal */}
        <div className="bg-white flex justify-center flex-col items-center py-1">
            <div className="flex flex-col cursor-pointer select-none hover:bg-grey1/20 active:bg-grey1/10 rounded-lg px-2 py-1 transition-colors duration-100">
                <img src="/img/ikonAiSoal.png" alt="AI" className="w-10"/>
                <div className="text-my-text">AI Soal</div>
            </div>
        </div>

        {/* semua bab */}
        <div className="h-full w-screen flex justify-center">
            <div className="max-w-full h-full w-fit sm:max-w-[80%] md:max-w-[90%] flex-col flex items-start pt-5">
                <div className="text-lg font-semibold text-my-text mb-3 ps-2">Semua Bab</div>
                <div className="w-full h-max grid grid-cols-1 md:grid-cols-2 gap-5">
                {babWithProgress.length === 0 && (
                    <div className="col-span-full text-center text-gray-400">
                    Tidak ada bab ditemukan.
                    </div>
                )}
                {babWithProgress.map((bab) => (
                    <NavLink to={`/ruang-belajar/${id}/${bab.id_bab}`} className={'min-h-20'} key={bab.id_bab} >
                    <div
                        className={`bg-white h-full rounded-lg relative flex items-center ${Number(bab.harga) === 0 ? 'pt-10' : 'pt-4'} pb-5 pe-4 border-2 border-white ${tema.hoverBorder} transition-colors duration-200 active:border-white`}
                        style={{ boxShadow: '0px 8px 16px 0px rgba(60, 71, 103, 0.06)' }}
                    >
                        {Number(bab.harga) === 0 ? (
                        <div className={`w-fit h-fit text-xs px-2 py-1 text-white ${tema.bg} rounded-sm rounded-tl-md top-0 absolute`}>
                            Subbab gratis
                        </div>
                        ) : null}

        <img src={bab.icon || "/img/default.png"} alt='Ikon' className="w-15 h-fit ms-5" />
        <div className="flex flex-col items-start ms-4">
          <div>{bab.judul_bab}</div>
          <div className="flex gap-2 items-center mt-2">
            <img src="/img/ikonAdapto.png" alt="adapto" className=" w-15" />
            {/* progress bar */}
            <div className="w-65 h-4 rounded-full bg-grey3/30 flex items-center">
              <div className={`h-full rounded-full flex items-center justify-end pe-2 ${tema.bg}`} style={{ width: `${bab.progres}%` }}>
                <span className="text-xs text-white"> {bab.progres > 10 ? bab.progres : ''}</span>
              </div>
              <span className="text-xs ps-1"> {bab.progres <= 10 ? bab.progres : ''}</span>
            </div>
          </div>
        </div>
      </div>
    </NavLink>
  ))}
</div>
            </div>
        </div>

        <div className="h-30"></div>
    </div>
);
}

export default RuangMateri;