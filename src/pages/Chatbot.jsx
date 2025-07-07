import React from "react";
import LoginButton from "../components/LoginButton";
import Topbar from "../components/Topbar";
import '../style.css'; 
import Sidebar from "../components/Sidebar";
import BurgerMenu from "../components/BurgerMenu";
import { useState, useRef, createContext, useContext } from "react";
import Asidebar from "../components/Asidebar";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";

// Context untuk dark mode
const DarkModeContext = createContext();
const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export const useDarkMode = () => useContext(DarkModeContext);

function Chatbot(){

    // Sidebar 
    const [left, setLeft] = useState('-left-70') 
    const [bg, setBg] = useState('bg-transparent -z-10')
    const [isSidebarHidden, setIsSidebarHidden] = useState(true)
    const iconSize = '20px'
    const menuButton = <svg xmlns="http://www.w3.org/2000/svg" id='menu' height={iconSize} viewBox="0 -960 960 960" width={iconSize} className="fill-my-text dark:fill-my-text-dark"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>
    const closeButton = <svg xmlns="http://www.w3.org/2000/svg" id='close' height={iconSize} viewBox="0 -960 960 960" width={iconSize} className="fill-my-text dark:fill-my-text-dark"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>;
    const [menuIcon, setMenuIcon] = useState(isSidebarHidden? menuButton : closeButton)
    
    // chatbot
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const inputRef = useRef(null);

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


    // Handle sending message
    const sendMessage = async (text) => {
        setMessages((msgs) => [
            ...msgs,
            { role: "user", content: text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        ]);
        setLoading(true);
        try {
            const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${API_KEY}`,
                },
                body: JSON.stringify({
                    model: "llama3-70b-8192",
                    messages: [
                        { role: "system", content: "Jawablah semua pertanyaan dalam bahasa Indonesia." },
                        ...messages.map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content })),
                        { role: "user", content: text },
                    ],
                }),
            });
            const data = await res.json();
            const aiMsg = data.choices?.[0]?.message?.content || "(No response)";
            setMessages((msgs) => [
                ...msgs,
                { role: "assistant", content: aiMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
            ]);
        } catch (e) {
            setMessages((msgs) => [
                ...msgs,
                { role: "assistant", content: "Error: " + e.message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
            ]);
        }
        setLoading(false);
    };

    // Fungsi untuk refresh chat baru
    const handleNewChat = () => {
        setMessages([]);
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    };

    // Toggle dark mode
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return(
        <div className="h-screen overflow-x-hidden">
        {/* <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}> */}
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
                    <LoginButton onLogin={() => alert("Login button clicked!")} onSubscribe={() => alert("Subscribe button clicked!")}/>    
                </Topbar>
            </div>

            <div className='flex h-full transition-colors duration-300 dark:bg-gray-900 bg-gray-50'>
                <div className={`asidebar h-screen ${asidebarLeft} transition-all duration-200 z-5`} onClick={toggleAsidebar}>
                    <Asidebar onNewChat={handleNewChat} >
                        <div onClick={toggleAsidebar} className="cursor-pointer hidden flexAt768 p-1 rounded-full hover:bg-indigo-50 duration-150">
                            <img className="rotate-90" src='/img/arrowDown.png' width={'20px'}/>
                        </div>
                    </Asidebar>
                </div>
                <div className="flex flex-col flex-1 ">
                    {/* <Header /> */}
                    <div className="w-full flex border-b-2 h-35 border-gray-200 justify-between pe-6 items-center">
                        {/* choose ai version */}
                        <span className="flex gap-2 items-center font-semibold text-lg pt-15 ps-4 cursor-pointer">
                            <div onClick={toggleAsidebar} className="cursor-pointer hidden flexAt768 p-1 rounded-full hover:bg-indigo-50 duration-150">
                                <img className="-rotate-90" src='/img/arrowDown.png' width={'20px'}/>
                            </div>
                            Edu AI 2.1
                            <span><img src="/img/arrowDown.png" alt="show all" width={'20px'} /></span>
                        </span>

                        {/* user profile */}
                        <span className="rounded-full flex items-center pt-15 relative ">
                            <img src="/img/dummyUser.png" alt="user" width={'40px'} className="rounded-full"/>
                            <div className="w-[10px] h-[10px]  bg-green-500 rounded-full bottom-0 right-0 absolute border border-surface"></div>
                        </span>
                    </div>
                    <ChatWindow messages={messages} loading={loading} />
                    <ChatInput onSend={sendMessage} loading={loading} inputRef={inputRef} />
                </div>
            </div>
        {/* </DarkModeContext.Provider> */}

        </div>
    );
}

export default Chatbot;