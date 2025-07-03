import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import BurgerMenu from "../components/BurgerMenu";
import { useState, useEffect } from "react";
import { useDebounce } from "react-use";

const Search = ({searchTerm, setSearchTerm}) => {

    return(
        <div className="search rounded-xl p-4 shadow-sm flex flex-col sm:flex-row w-80">
            <div className="relative flex items-center flex-1 bg-white rounded-full">

                <img className="absolute left-2" src="./img/search_icon.png" alt="search" width={'25px'} />
                
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

const listSubbab = [
    {
        id: 1,
        title: 'Surat Lamaran Pekerjaan dan Daftar Riwayat Hidup ⚡',
        progres: 10,
        ikon: './img/ikonSuratLamaranKerja.png',
        isGratis: true,
    },
    {
        id: 2,
        title: 'Teks Cerita Sejarah ⚡',
        progres: 15,
        ikon: './img/ikonTeksSejarah.png',
        isGratis: true,
    },
    {
        id: 3,
        title: 'Teks Editorial ⚡',
        progres: 0,
        ikon: './img/ikonTeksEditorial.png',
        isGratis: false,
    },
    {
        id: 4,
        title: 'Novel ⚡',
        progres: 20,
        ikon: './img/ikonNovel.png',
        isGratis: true,
    },
    {
        id: 5,
        title: 'Teks Iklan ⚡',
        progres: 5,
        ikon: './img/ikonTeksIklan.png',
        isGratis: true,
    },
    {
        id: 6,
        title: 'Teks Artikel ⚡',
        progres: 90,
        ikon: './img/ikonTeksArtikel.png',
        isGratis: false,
    },
    {
        id: 7,
        title: 'Kritik Sastra dan Esai ⚡',
        progres: 30,
        ikon: './img/ikonKritikSastra.png',
        isGratis: true,
    },
    {
        id: 8,
        title: 'Buku Pengayaan (Nonfiksi) dan Buku Drama (Fiksi) ⚡',
        progres: 60,
        ikon: './img/ikonPengayaan.png',
        isGratis: true,
    },
];

function RuangBelajarBahasaIndo(){

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

return(
    <div className="w-screen text-sm bg-my-bg ">
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
        <div className="flex sm:flex-row flex-col justify-between px-4 items-center bg-indoRed text-white">
            <div className="flex gap-2 items-center mt-4 sm:mt-0 w-full sm:w-fit">
                <img src="./img/ikonKelasBahasaIndo.png" alt="icon" className="w-10"/>
                <div className="pb-2 text-lg ">Bahasa Indonesia</div>
            </div>
            
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        </div>

        {/* AI Soal */}
        <div className="bg-white flex justify-center flex-col items-center py-1">
            <div className="flex flex-col cursor-pointer select-none hover:bg-grey1/20 rounded-lg px-2 py-1 transition-colors duration-100">
                <img src="./img/ikonAiSoal.png" alt="AI" className="w-10"/>
                <div className="text-my-text">AI Soal</div>
            </div>
        </div>

        {/* semua bab */}
        <div className="h-full w-screen flex justify-center">
            <div className="max-w-full h-full w-fit sm:max-w-[80%] md:max-w-[90%] flex-col flex items-start pt-5">
                <div className="text-lg font-semibold text-my-text mb-3 ps-2">Semua Bab</div>
                <div className="w-full h-max grid grid-cols-1 md:grid-cols-2 gap-5">
                    {listSubbab.map((subbab) => 
                        <div className={` min-h-20 bg-white rounded-lg relative flex items-center ${subbab.isGratis ? 'pt-10' : 'pt-4'} pb-5 pe-4`} key={subbab.id} 
                        style={{boxShadow: '0px 8px 16px 0px rgba(60, 71, 103, 0.06)'}}>
                            {subbab.isGratis ? <div className="w-fit h-fit text-xs px-2 py-1 text-white bg-indoRed rounded-sm rounded-tl-lg top-0 absolute">Subbab gratis</div> : <div></div> }
                            
                            <img src={subbab.ikon} alt='Ikon' className="w-15 h-fit ms-5"/>
                            <div className="flex flex-col items-start ms-4">
                                <div>{subbab.title}</div>
                                <div className="flex gap-2 items-center mt-2">
                                    <img src="./img/ikonAdapto.png" alt="adapto" className=" w-15" />
                                    {/* progress bar */}
                                    <div className="w-65 h-4 rounded-full bg-grey3/30 flex items-center">
                                        <div className="bg-indoRed h-full rounded-full flex items-center justify-end pe-2" style={{width: `${subbab.progres}%`}}>
                                            <span className="text-xs text-white"> {subbab.progres > 10 ? subbab.progres : ''}</span>
                                        </div>
                                        <span className="text-xs ps-1"> {subbab.progres <= 10 ? subbab.progres : ''}</span>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    )}

                </div>
            </div>
        </div>

        <div className="h-30"></div>
    </div>
);
}

export default RuangBelajarBahasaIndo;