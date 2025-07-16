import { useState } from "react";
import { useParams } from "react-router";
import '../style.css'; 
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import BurgerMenu from "../components/BurgerMenu";
import MateriPageAsidebar from "../components/MateriPageAsidebar";

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
    const param = useParams();

    //asidebar
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [asidebarLeft, setAsidebarLeft] = useState('left-0');
    const [isAsidebarHidden, setIsAsidebarHidden] = isMobile ? useState(true) : useState(false);

    //function to hide/unhide the asidebar
    function toggleAsidebar() {
        if(window.innerWidth <= 768) {
            if (asidebarLeft === '-left-100') {
                setAsidebarLeft('left-0');
            } else {
                setAsidebarLeft('-left-100');
            }
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

    return(
        <div>
            <Sidebar 
                className='absolute'
                hideSidebar={hideSidebar} 
                left={left} 
                bg={bg}
            >
                <BurgerMenu icon={menuIcon} handleClick={hideSidebar}/>
            </Sidebar>

            <div className="absolute w-screen z-10">
                <Topbar>
                    <BurgerMenu icon={menuIcon} handleClick={hideSidebar}/>
                    <div></div>
                </Topbar>
            </div>

            <div className={`asidebar h-screen ${asidebarLeft} transition-all duration-200 z-5`} onClick={toggleAsidebar}>
                <MateriPageAsidebar>
                    <div onClick={toggleAsidebar} className="cursor-pointer hidden flexAt768 p-1 rounded-full hover:bg-indigo-50 duration-150">
                        <img className="rotate-90" src='/img/arrowDown.png' width={'20px'}/>
                    </div>
                </MateriPageAsidebar>
            </div>
            <h1>Page Materi Belajar {param.kelas} {param.materi}</h1>
        </div>
    );
}

export default MateriBelajarPage;