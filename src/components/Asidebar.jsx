import React, { Children } from "react";
import { useState } from "react";

export default function Asidebar({ onNewChat, children }) {
	
	const elements = Children.toArray(children);

	// Dummy data judul riwayat chat
	const dummyHistory = [
		"Cara membuat brownies sederhana",
		"Penjelasan React JS untuk pemula",
		"Perbedaan AI dan Machine Learning",
		"Tips belajar pemrograman efektif",
		"Bagaimana cara kerja blockchain?",
	];

	//asidebar
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
	
	
	return (
		<aside className='w-72 h-full backdrop-blur-md shadow-2xl rounded-t-3xl flex flex-col border transition-colors duration-300 overflow-y-scroll
		dark:bg-gray-800/60 dark:border-gray-600/30
		bg-surface border-white/30'
		>
			<div className="for-scroll">

			{/* logo */}
			<div className="flex items-center justify-between gap-2 py-5 pt-20 px-5 h-35 border-b-2 border-gray-200 mb-4">
				<div className="flex gap-2 items-center">
					<img src="/img/chatbot_logo.png" alt="ChatBot" width={'30px'}/>
					<div className={`text-xl lg:text-3xl font-extrabold tracking-wide drop-shadow transition-colors duration-300 dark:text-white `}>
						ChatBot
					</div>
				</div>

				<img src="/img/edit.png" alt="edit" width={'25px'}/>
				
				{elements[0]}
			
			</div>
			
			{/* new chat button */}
			<button
				className="mx-4 mb-4 px-4 py-2 border-indigo-100 bg-gradient-to-r from-indigo-500 to-indigo-700  hover:from-indigo-600 hover:to-indigo-800 text-white rounded-full font-semibold shadow-lg transition-colors duration-200 text-center flex items-center gap-1 cursor-pointer" 
				type="button"
				onClick={onNewChat}
			>
				<span>+</span> <span> Chat Baru</span>
			</button>
			
			{/* today chat history */}
			<div className="flex-1 overflow-y-autos pb-6 border-b border-gray-200 h-fit mb-5">
			
				<div className='py-2 tracking-wider font-semibold transition-colors duration-300 flex justify-between items-center px-5
				dark:text-gray-400 '>
					<span>Today</span> 
					<span className="text-my-text/50 text-sm flex gap-2 items-center p-1 px-2 rounded-sm hover:bg-indigo-100 cursor-pointer transition-colors duration-200 hover:text-my-text/80">
						12 total 
						<span><img src="/img/arrowDown.png" alt="show all" width={'15px'}/></span>
					</span>
				</div>
				
				<ul className="space-y-1 mt-2">
					{dummyHistory.map((judul, idx) => (
						<li
						key={idx}
						className='px-5 py-3 shadow truncate cursor-pointer transition-all border
						dark:hover:bg-gray-600 dark:text-gray-200 dark:border-gray-600/40
						hover:bg-indigo-50 border-white/40'
						title={judul}     
						>
							{judul}
						</li>
					))}
				</ul>
			</div>

			{/* 7-day chat history */}
			<div className="flex-1 overflow-y-autos pb-6 border-b border-gray-200 h-fit mb-5">
			
				<div className='py-2 tracking-wider font-semibold transition-colors duration-300 flex justify-between items-center px-5
				dark:text-gray-400 '>
					<span>7-days</span> 
					<span className="text-my-text/50 text-sm flex gap-2 items-center p-1 px-2 rounded-sm hover:bg-indigo-100 cursor-pointer transition-colors duration-200 hover:text-my-text/80">
						34 total 
						<span><img src="/img/arrowDown.png" alt="show all" width={'15px'}/></span>
					</span>
				</div>
				
				<ul className="space-y-1 mt-2">
					{dummyHistory.map((judul, idx) => (
						<li
						key={idx}
						className='px-5 py-3 shadow truncate cursor-pointer transition-all border
						dark:hover:bg-gray-600 dark:text-gray-200 dark:border-gray-600/40
						hover:bg-indigo-50 border-white/40'
						title={judul}     
						>
							{judul}
						</li>
					))}
				</ul>
			</div>
			</div>
			
		</aside>
	);
} 