import { Children, useState } from "react";
import { NavLink } from "react-router";

export default function MateriPageAsidebar({ onNewChat, children }) {   
	
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
		<aside className='w-85 h-full shadow-xl flex flex-col transition-colors duration-300 overflow-auto
		dark:bg-gray-800/60 dark:border-gray-600/30
		bg-indigo-50' 
		>
		<div className="for-scroll">

			<div className="flex gap-3 w-full justify-center mt-40">
				{/* <NavLink to="/exam">
					<div className="bg-white rounded-xl p-3 flex flex-col gap-2 items-center w-30 cursor-pointer hover:bg-indigo-100 transition-colors duration-150">
						<img src="/img/ikonKuisAkhir.png" alt="" className="w-10"/>
						<div>Kuis Akhir</div>
					</div>
				</NavLink>
				<div className="bg-white rounded-xl p-3 flex flex-col gap-2 items-center w-30 cursor-pointer hover:bg-indigo-100 transition-colors duration-150">
					<img src="/img/ikonRangkuman.png" alt="" className="w-10"/>
					<div>Rangkuman</div>
				</div> */}
			</div>
			
			{elements[0]}
			
			
		</div>	
		</aside>
	);
} 