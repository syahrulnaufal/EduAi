import { useRef, useEffect } from "react";
import '../style.css'
// import { useDarkMode } from "../pages/Chatbot.jsx";



const botAvatar = (
    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2 border border-indigo-300">
        <span role="img" aria-label="bot" className="text-indigo-500 text-xl">🤖</span>
    </div>
);
const userAvatar = (
    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center ml-2">
        <span role="img" aria-label="user" className="text-white text-xl">🧑</span>
    </div>
);

// Fungsi untuk mem-bold teks diapit ** atau `
function formatBold(text) {
    if (!text) return "";
    // Ganti **teks** dan `teks` dengan <strong>teks</strong>
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`([^`]+)`/g, '<strong>$1</strong>');
}

export default function ChatWindow({ messages, loading }) {
    // const { darkMode } = useDarkMode();
    const bottomRef = useRef(null);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    return (
        <main className='flex-1 overflow-y-auto py-6 transition-colors duration-300 
                dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800
                bg-gradient-to-br from-white to-indigo-50'
            >
            <div className="max-w-2xl mx-auto flex flex-col gap-2 px-5">
                {messages.length === 0 && !loading && (
                    <div className='text-center mt-24 select-none transition-colors duration-300 dark:text-gray-400 text-gray-400'>
                        <div className="text-2xl font-semibold mb-2">Selamat datang di ChatBot Edu AI 2.0!</div>
                        <div className="text-base">Silakan mulai percakapan dengan mengetik pertanyaan atau perintah Anda di bawah ini.</div>
                    </div>
                )}
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex items-end mb-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        {msg.role === "assistant" && botAvatar}
                        <div
                            className={`relative px-5 py-3 rounded-2xl shadow-md transition-all duration-200 animate-fadeIn ${msg.role === "user"
                                    ? "bg-indigo-600 text-white rounded-br-md" : 
                                     "dark:bg-gray-700 dark:text-gray-200 dark:border dark:border-gray-600 dark:rounded-bl-md bg-white text-gray-800 border border-indigo-100 rounded-bl-md"
                                } max-w-[80%] flex flex-col`}
                        >
                            {msg.content === "<image>" && msg.image ? (
                                <img src={msg.image} alt="AI" className="rounded-lg max-w-xs" />
                            ) : (
                                <span
                                    style={{ whiteSpace: "pre-line" }}
                                    dangerouslySetInnerHTML={{ __html: formatBold(msg.content) }}
                                />
                            )}
                            <span className='text-[10px] mt-1 self-end transition-colors duration-300 text-gray-400'>
                                {msg.time}
                            </span>
                        </div>
                        {msg.role === "user" && userAvatar}
                    </div>
                ))}
                {loading && (
                    <div className="flex items-end mb-2 justify-start">
                        {botAvatar}
                        <div className='relative px-5 py-3 rounded-2xl border max-w-[80%] flex items-center animate-fadeIn transition-colors duration-300 
                                dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400
                                bg-white border-indigo-100 text-gray-400'
                            >
                            <div className="flex items-center space-x-1 mr-3">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                            <span>AI sedang mengetik...</span>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>
            
        </main>
    );
} 