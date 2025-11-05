import React, { useState, useRef, createContext, useContext, useEffect, useCallback } from "react";
import LoginButton from "../components/LoginButton";
import Topbar from "../components/Topbar";
import '../style.css';
import Sidebar from "../components/Sidebar";
import BurgerMenu from "../components/BurgerMenu";
import Asidebar from "../components/Asidebar";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";

// Context untuk dark mode
const DarkModeContext = createContext();

// API and BASE URLs from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5173';

export const useDarkMode = () => useContext(DarkModeContext);

function Chatbot() {
    const iconSize = '20px'
    const menuButton = <svg xmlns="http://www.w3.org/2000/svg" id='menu' height={iconSize} viewBox="0 -960 960 960" width={iconSize} className="fill-my-text dark:fill-my-text-dark"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" /></svg>
    const closeButton = <svg xmlns="http://www.w3.org/2000/svg" id='close' height={iconSize} viewBox="0 -960 960 960" width={iconSize} className="fill-my-text dark:fill-my-text-dark"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg>;

    // Sidebar 
    const [left, setLeft] = useState('-left-70')
    const [bg, setBg] = useState('bg-transparent -z-10')
    const [isSidebarHidden, setIsSidebarHidden] = useState(true)
    const [menuIcon, setMenuIcon] = useState(menuButton)

    // chatbot
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const inputRef = useRef(null);
    
    // State untuk user info
    const [currentUser, setCurrentUser] = useState(null);
    
    // State untuk conversation management
    const [conversations, setConversations] = useState([]);
    const [activeConversationId, setActiveConversationId] = useState(null);

    //asidebar
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [asidebarLeft, setAsidebarLeft] = useState(isMobile ? '-left-full' : 'left-0');

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile) {
                setAsidebarLeft('left-0');
            } else {
                setAsidebarLeft('-left-full');
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    //function to hide/unhide the asidebar
    const toggleAsidebar = useCallback(() => {
        if (isMobile) {
            setAsidebarLeft(prev => prev === 'left-0' ? '-left-full' : 'left-0');
        }
    }, [isMobile]);

    // Function to hide the sidebar
    const hideSidebar = useCallback(() => {
        if (isSidebarHidden) {
            setLeft('left-0')
            setBg('bg-my-bg-dark/70 z-20')
            setMenuIcon(closeButton)
        } else {
            setLeft('-left-70')
            setBg('bg-transparent -z-10')
            setMenuIcon(menuButton)
        }
        setIsSidebarHidden(prev => !prev);
    }, [isSidebarHidden, closeButton, menuButton]);

    // Handle sending message (via backend)
    const sendMessage = useCallback(async (text) => {
        if (!text.trim()) return;

        console.log("🚀 Sending message with activeConversationId:", activeConversationId);

        const newUserMsg = {
            role: "user",
            content: text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, newUserMsg]);
        setLoading(true);

        try {
            const requestBody = {
                message: text, 
                conversationId: activeConversationId 
            };
            console.log("📤 Request body:", requestBody);

            const res = await fetch(`${API_URL}/api/chat/send`, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                },
                body: JSON.stringify(requestBody),
                credentials: "include" // jika menggunakan cookie untuk session agar cookie dikirim dan diterima backend
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error ?? "Gagal Request ke AI");
            }

            const data = await res.json();
            const aiMsg = data.reply || "(No response from AI)";
            
            // Update activeConversationId jika ini adalah pesan pertama
            if (!activeConversationId && data.conversationId) {
                setActiveConversationId(data.conversationId);
                // Reload conversations list
                loadConversations();
            }
            
            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content: aiMsg,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                },
            ]);
        } catch (e) {
            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content: `Error: ${e.message}`,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                },
            ]);
        } finally {
            setLoading(false);
        }
    }, [activeConversationId]);

    // Fungsi untuk refresh chat baru (via backend)
    const handleNewChat = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/api/chat/conversations`, { 
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                },
                body: JSON.stringify({ title: "Chat Baru" }),
                credentials: "include" 
            });
            
            if (res.ok) {
                const data = await res.json();
                setActiveConversationId(data.id_conversation);
                setMessages([]);
                loadConversations(); // Reload conversations list
                inputRef.current?.focus();
            }
        } catch (e) {
            console.error("Error creating new chat:", e);
            // Fallback: clear current messages without creating new conversation
            setActiveConversationId(null);
            setMessages([]);
            inputRef.current?.focus();
        }
    }, []);

    // Load conversations list
    const loadConversations = useCallback(async () => {
        try {
            console.log("📋 Loading conversations...");
            const res = await fetch(`${API_URL}/api/chat/conversations`, {
                credentials: "include"
            });
            
            if (res.ok) {
                const data = await res.json();
                console.log("📚 Conversations received:", data);
                setConversations(data);
                
                // Set active conversation to the most recent one if none is selected
                if (!activeConversationId && data.length > 0) {
                    setActiveConversationId(data[0].id_conversation);
                }
            }
        } catch (e) {
            console.error("💥 Error loading conversations:", e);
        }
    }, [activeConversationId]);

    // Load messages from specific conversation
    const loadConversationMessages = useCallback(async (conversationId) => {
        if (!conversationId) return;
        
        try {
            console.log(`💬 Loading messages for conversation ${conversationId}...`);
            const res = await fetch(`${API_URL}/api/chat/conversations/${conversationId}/messages`, {
                credentials: "include"
            });
            
            if (res.ok) {
                const data = await res.json();
                console.log("📚 Messages received:", data);
                
                // Convert format dari database ke format frontend
                const formattedMessages = data.map(msg => ({
                    role: msg.role,
                    content: msg.isi_chat,
                    time: new Date(msg.tanggal).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }));
                
                setMessages(formattedMessages);
                setActiveConversationId(conversationId);
            }
        } catch (e) {
            console.error("💥 Error loading conversation messages:", e);
        }
    }, []);

    // Function to select conversation
    const selectConversation = useCallback((conversationId) => {
        console.log(`🎯 Selecting conversation: ${conversationId}`);
        loadConversationMessages(conversationId);
    }, [loadConversationMessages]);

    // Load conversations on component mount
    useEffect(() => {
        loadConversations();
    }, [loadConversations]);

    // Load current user info
    useEffect(() => {
        const loadCurrentUser = () => {
            const userStr = localStorage.getItem("user");
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    setCurrentUser(user);
                    console.log("👤 Current user:", user);
                } catch (e) {
                    console.error("Error parsing user data:", e);
                }
            } else {
                // Jika tidak ada user, redirect ke login
                console.log("🔒 No user found, redirecting to login");
                window.location.href = `/login`;
            }
        };
        loadCurrentUser();
    }, []);

    // Toggle dark mode
    const toggleDarkMode = useCallback(() => {
        setDarkMode(prev => !prev);
    }, []);

    return (
        <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
            <div className={`h-screen overflow-x-hidden ${darkMode ? 'dark' : ''}`}>
                <Sidebar
                    className='absolute'
                    hideSidebar={hideSidebar}
                    left={left}
                    bg={bg}
                >
                    <BurgerMenu icon={menuIcon} handleClick={hideSidebar} />
                </Sidebar>

                <div className="absolute w-screen z-10">
                    <Topbar>
                        <BurgerMenu icon={menuIcon} handleClick={hideSidebar} />
                        <LoginButton onLogin={() => alert("Login button clicked!")} onSubscribe={() => alert("Subscribe button clicked!")} />
                    </Topbar>
                </div>

                <div className='flex h-full transition-colors duration-300 dark:bg-gray-900 bg-gray-50'>
                    <div className={`asidebar h-screen ${asidebarLeft} transition-all duration-200 z-5`} >
                        <Asidebar 
                            onNewChat={handleNewChat}
                            conversations={conversations}
                            activeConversationId={activeConversationId}
                            onSelectConversation={selectConversation}
                            onConversationsUpdate={loadConversations}
                        >
                            <div className="cursor-pointer hidden flexAt768 p-1 rounded-full hover:bg-indigo-50 duration-150">
                                <img onClick={()=>toggleAsidebar()} className="rotate-90" src='/img/arrowDown.png' width={'20px'} />
                            </div>
                        </Asidebar>
                    </div>
                    <div className="flex flex-col flex-1 ">
                        <div className="w-full flex border-b-2 h-35 border-gray-200 justify-between pe-6 items-center">
                            <span className="flex gap-2 items-center font-semibold text-lg pt-15 ps-4 cursor-pointer">
                                <div onClick={toggleAsidebar} className="cursor-pointer hidden flexAt768 p-1 rounded-full hover:bg-indigo-50 duration-150">
                                    <img className="-rotate-90" src='/img/arrowDown.png' width={'20px'} />
                                </div>
                                Edu AI 2.1
                                {currentUser && (
                                    <span className="text-sm text-gray-500">
                                        - {currentUser.username}
                                    </span>
                                )}
                                {/* <span><img src="/img/arrowDown.png" alt="show all" width={'20px'} /></span> */}
                            </span>

                            <span className="rounded-full flex items-center pt-15 relative ">
                                <div className="rounded-full w-[40px] h-[40px]" style={{backgroundImage: `url(${currentUser?.profile_image})`, backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
                                {/* <img src={currentUser?.profile_image} alt="user" width={'40px'} className="rounded-full bg-contain" /> */}
                                <div className="w-[10px] h-[10px]  bg-green-500 rounded-full bottom-0 right-0 absolute border border-surface"></div>
                            </span>
                        </div>
                        <ChatWindow messages={messages} loading={loading} />
                        <ChatInput onSend={sendMessage} loading={loading} inputRef={inputRef} />
                    </div>
                </div>
            </div>
        </DarkModeContext.Provider>
    );
}

export default Chatbot;
