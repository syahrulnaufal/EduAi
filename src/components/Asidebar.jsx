import { Children, useState, useMemo } from "react";

export default function Asidebar({ onNewChat, children, conversations = [], activeConversationId, onSelectConversation }) {
	
	const elements = Children.toArray(children);

	// Group conversations by date
	const groupedConversations = useMemo(() => {
		const now = new Date();
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
		const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

		const groups = {
			today: [],
			yesterday: [],
			thisWeek: [],
			older: []
		};

		conversations.forEach(conv => {
			const convDate = new Date(conv.updated_at || conv.created_at);
			convDate.setHours(0, 0, 0, 0); // Reset time for comparison
			
			if (convDate.getTime() === today.getTime()) {
				groups.today.push(conv);
			} else if (convDate.getTime() === yesterday.getTime()) {
				groups.yesterday.push(conv);
			} else if (convDate >= thisWeek) {
				groups.thisWeek.push(conv);
			} else {
				groups.older.push(conv);
			}
		});

		return groups;
	}, [conversations]);

	// Function to render conversation group
	const renderConversationGroup = (title, convList) => {
		if (convList.length === 0) return null;

		return (
			<div className="flex-1 overflow-y-auto pb-6 border-b border-gray-200 h-fit mb-5">
				<div className='py-2 tracking-wider font-semibold transition-colors duration-300 flex justify-between items-center px-5 dark:text-gray-400'>
					<span>{title}</span>
					<span className="text-my-text/50 text-sm flex gap-2 items-center p-1 px-2 rounded-sm hover:bg-indigo-100 cursor-pointer transition-colors duration-200 hover:text-my-text/80">
						{convList.length} total
						<span><img src="/img/arrowDown.png" alt="show all" width={'15px'}/></span>
					</span>
				</div>
				
				<ul className="space-y-1 mt-2">
					{convList.map((conv) => (
						<li
							key={conv.id_conversation}
							className={`px-5 py-3 truncate cursor-pointer transition-all border
								dark:hover:bg-gray-600 dark:text-gray-200 dark:border-gray-600/40
								hover:bg-indigo-50 border-white/40
								${activeConversationId === conv.id_conversation ? 'bg-indigo-100 dark:bg-gray-600' : ''}`}
							title={conv.title}
							onClick={() => onSelectConversation && onSelectConversation(conv.id_conversation)}
						>
							{conv.title}
							<div className="text-xs text-gray-500 mt-1">
								{conv.message_count} pesan
							</div>
						</li>
					))}
				</ul>
			</div>
		);
	};
	
	
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
			
			{/* Conversation history */}
			{renderConversationGroup("Today", groupedConversations.today)}
			{renderConversationGroup("Yesterday", groupedConversations.yesterday)}
			{renderConversationGroup("This Week", groupedConversations.thisWeek)}
			{renderConversationGroup("Older", groupedConversations.older)}
			</div>
			
		</aside>
	);
} 