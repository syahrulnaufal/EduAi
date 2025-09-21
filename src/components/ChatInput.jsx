import React, { useState, useRef, useEffect } from "react";
// import { useDarkMode } from "../pages/Chatbot.jsx";


export default function ChatInput({ onSend, loading, inputRef }) {
    // const { darkMode } = useDarkMode();
    const [text, setText] = useState("");
    const localRef = useRef(null);
    const refToUse = inputRef || localRef;
    useEffect(() => {
        refToUse.current?.focus();
    }, []);
    const handleSend = (e) => {
        e.preventDefault();
        if (!text.trim() || loading) return;
        onSend(text);
        setText("");
        refToUse.current?.focus();
    };
    return (
        <form onSubmit={handleSend} className='px-8 py-4 flex flex-col items-center transition-colors duration-300 dark:bg-gray-800 dark:border-t dark:border-gray-700 border-gray-200 bg-white border-t'>
            <div className="w-full max-w-2xl flex items-center gap-2">
                <input
                    ref={refToUse}
                    className='flex-1 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors duration-300 
                            dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400
                            text-gray-800 placeholder-gray-200 border-gray-300 focus:border-indigo-500 shadow-sm
                            border'
                    type="text"
                    placeholder="Message slothGPT..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-indigo-600 text-white rounded-full px-4 py-2 font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                    disabled={loading || !text.trim()}
                >
                    <span role="img" aria-label="send">➤</span>
                </button>
            </div>
            <div className='text-xs mt-2 transition-colors duration-300 dark:text-gray-400 text-gray-400'>
                slothGPT can make mistakes. Check our Terms & Conditions.
            </div>
        </form>
    );
} 