import { Children, useState, useMemo, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Asidebar({ onNewChat, children, conversations = [], activeConversationId, onSelectConversation, onConversationsUpdate }) {
	
	const elements = Children.toArray(children);
	const [openDropdown, setOpenDropdown] = useState(null);
	const [renameModal, setRenameModal] = useState({ open: false, conversationId: null, currentTitle: '' });
	const [newTitle, setNewTitle] = useState('');

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

	// Function to handle conversation deletion
	const handleDeleteConversation = async (conversationId) => {
		const result = await Swal.fire({
			title: 'Hapus Percakapan?',
			text: 'Percakapan ini akan dihapus permanen dan tidak dapat dikembalikan.',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#ef4444',
			cancelButtonColor: '#6b7280',
			confirmButtonText: 'Ya, Hapus',
			cancelButtonText: 'Batal',
			reverseButtons: true
		});

		if (result.isConfirmed) {
			try {
				const response = await fetch(`${API_URL}/api/chat/conversations/${conversationId}`, {
					method: 'DELETE',
					credentials: 'include'
				});

				if (response.ok) {
					// Call parent callback to refresh conversations
					if (onConversationsUpdate) {
						onConversationsUpdate();
					}
					// If the deleted conversation was active, clear the active state
					if (activeConversationId === conversationId) {
						// You might want to select another conversation or clear the chat
						window.location.reload(); // Simple solution for now
					}
					Swal.fire({
						title: 'Berhasil!',
						text: 'Percakapan telah dihapus.',
						icon: 'success',
						timer: 1500,
						showConfirmButton: false
					});
				} else {
					const error = await response.json();
					Swal.fire({
						title: 'Error!',
						text: error.msg || 'Gagal menghapus percakapan',
						icon: 'error'
					});
				}
			} catch (error) {
				console.error('Error deleting conversation:', error);
				Swal.fire({
					title: 'Error!',
					text: 'Terjadi kesalahan saat menghapus percakapan',
					icon: 'error'
				});
			}
		}
		setOpenDropdown(null);
	};

	// Function to handle conversation rename
	const handleRenameConversation = async () => {
		if (!newTitle.trim()) {
			Swal.fire({
				title: 'Peringatan!',
				text: 'Nama percakapan tidak boleh kosong',
				icon: 'warning'
			});
			return;
		}

		try {
			const response = await fetch(`${API_URL}/api/chat/conversations/${renameModal.conversationId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ title: newTitle.trim() }),
				credentials: 'include'
			});

			if (response.ok) {
				// Call parent callback to refresh conversations
				if (onConversationsUpdate) {
					onConversationsUpdate();
				}
				setRenameModal({ open: false, conversationId: null, currentTitle: '' });
				setNewTitle('');
				Swal.fire({
					title: 'Berhasil!',
					text: 'Nama percakapan berhasil diubah',
					icon: 'success',
					timer: 1500,
					showConfirmButton: false
				});
			} else {
				const error = await response.json();
				Swal.fire({
					title: 'Error!',
					text: error.msg || 'Gagal mengubah nama percakapan',
					icon: 'error'
				});
			}
		} catch (error) {
			console.error('Error renaming conversation:', error);
			Swal.fire({
				title: 'Error!',
				text: 'Terjadi kesalahan saat mengubah nama percakapan',
				icon: 'error'
			});
		}
	};

	// Function to open rename modal
	const openRenameModal = (conversationId, currentTitle) => {
		setRenameModal({ open: true, conversationId, currentTitle });
		setNewTitle(currentTitle);
		setOpenDropdown(null);
	};

	// Function to toggle dropdown
	const toggleDropdown = (conversationId, event) => {
		event.stopPropagation(); // Prevent conversation selection
		setOpenDropdown(openDropdown === conversationId ? null : conversationId);
	};

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (openDropdown && !event.target.closest('.dropdown-menu') && !event.target.closest('button')) {
				setOpenDropdown(null);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [openDropdown]);

	// Function to render conversation group
	const renderConversationGroup = (title, convList) => {
		if (convList.length === 0) return null;

		return (
			<div className="flex-1 overflow-y-auto pb-6 border-b border-gray-200 h-fit mb-5 overflow-x-visible">
				<div className='py-2 tracking-wider font-semibold transition-colors duration-300 flex justify-between items-center px-5 dark:text-gray-400'>
					<span className="text-lg">{title}</span>
					<span className="text-my-text/50 text-sm flex gap-2 items-center p-1 px-2 rounded-sm hover:bg-indigo-100 cursor-pointer transition-colors duration-200 hover:text-my-text/80">
						{convList.length} total
					</span>
				</div>
				
				<ul className="space-y-1 mt-2">
					{convList.map((conv) => (
						<li
							key={conv.id_conversation}
							className={`group relative px-3 py-2 mx-2 cursor-pointer transition-all rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700
								${activeConversationId === conv.id_conversation ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
						>
							<div 
								className="flex items-center justify-between w-full"
								onClick={() => onSelectConversation && onSelectConversation(conv.id_conversation)}
							>
								<div className="flex-1 min-w-0 mr-2">
									<div className="text-sm font-medium truncate text-gray-900 dark:text-gray-100" title={conv.title}>
										{conv.title}
									</div>
									<div className="text-xs text-gray-500 dark:text-gray-400">
										{conv.message_count} pesan
									</div>
								</div>
							</div>
							
							{/* Three dots menu button */}
							<button
								onClick={(e) => toggleDropdown(conv.id_conversation, e)}
								className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-opacity z-20"
								style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
							>
								<svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
									<path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
								</svg>
							</button>
							
							{/* Dropdown menu */}
							{openDropdown === conv.id_conversation && (
								<>
									{/* Backdrop for clicking outside */}
									<div 
										className="fixed inset-0 z-[9998]" 
										onClick={() => setOpenDropdown(null)}
									/>
									{/* Dropdown content */}
									<div className="dropdown-menu absolute right-2 top-10 w-48 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl shadow-2xl z-[9999] py-2 border border-gray-200 dark:border-gray-600">
										<button
											onClick={(e) => {
												e.stopPropagation();
												openRenameModal(conv.id_conversation, conv.title);
											}}
											className="w-full text-left px-4 py-2.5 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-3 transition-colors"
										>
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
											</svg>
											Ganti nama
										</button>
										<button
											onClick={(e) => {
												e.stopPropagation();
												handleDeleteConversation(conv.id_conversation);
											}}
											className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-600 hover:text-red-700 dark:hover:text-red-300 flex items-center gap-3 transition-colors"
										>
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
											</svg>
											Hapus
										</button>
									</div>
								</>
							)}
						</li>
					))}
				</ul>
			</div>
		);
	};
	
	
	return (
		<>
			<aside className='w-72 h-full backdrop-blur-md shadow-2xl rounded-t-3xl flex flex-col border transition-colors duration-300 overflow-y-auto overflow-x-visible
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

			{/* Rename Modal */}
			{renameModal.open && (
				<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-200">
					<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-80 max-w-sm mx-4 shadow-2xl transform transition-all duration-300 animate-in zoom-in-95 slide-in-from-bottom-4">
						<h3 className="text-lg font-bold mb-4 dark:text-white text-gray-900">Ganti Nama Percakapan</h3>
						<input
							type="text"
							value={newTitle}
							onChange={(e) => setNewTitle(e.target.value)}
							className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white bg-gray-50 dark:bg-gray-700/50 transition-all duration-200 focus:bg-white dark:focus:bg-gray-700"
							placeholder="Masukkan nama percakapan"
							maxLength={255}
							autoFocus
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									handleRenameConversation();
								} else if (e.key === 'Escape') {
									setRenameModal({ open: false, conversationId: null, currentTitle: '' });
									setNewTitle('');
								}
							}}
						/>
						<div className="flex gap-3 mt-6 justify-end">
							<button
								onClick={() => {
									setRenameModal({ open: false, conversationId: null, currentTitle: '' });
									setNewTitle('');
								}}
								className="px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-all duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600/50"
							>
								Batal
							</button>
							<button
								onClick={handleRenameConversation}
								className="px-4 py-2.5 text-sm font-medium bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
							>
								Simpan
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
} 