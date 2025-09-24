import React from "react";
import { useDarkMode } from "../pages/Chatbot.jsx";


export default function Header() {
    const { darkMode, toggleDarkMode } = useDarkMode();

    return (
        <header className={`flex items-center justify-between px-10 py-5 backdrop-blur-md shadow-lg rounded-2xl m-4 mt-6 border transition-colors duration-300 ${darkMode
                ? 'bg-gray-800/70 border-gray-600/30'
                : 'bg-white/70 border-white/30'
            }`}>
            <div className={`text-2xl font-bold tracking-wide drop-shadow transition-colors duration-300 ${darkMode ? 'text-white' : 'text-indigo-800'
                }`}>Edu AI 2.0</div>
            <div className="flex items-center gap-4">
                <button className={`p-2 rounded-full transition-colors duration-300 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-indigo-100'
                    }`}>
                    <span role="img" aria-label="settings" className="text-xl">⚙️</span>
                </button>
                <button
                    className={`p-2 rounded-full transition-colors duration-300 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-indigo-100'
                        }`}
                    onClick={toggleDarkMode}
                >
                    <span role="img" aria-label="theme" className="text-xl">
                        {darkMode ? '☀️' : '🌙'}
                    </span>
                </button>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-700 border-4 border-white/70 shadow flex items-center justify-center">
                    <span className="text-white text-xl">🧑</span>
                </div>
            </div>
        </header>
    );
} 