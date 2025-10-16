import React from "react";
import { Children } from "react";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

// ✅ 2. Fungsi getCurrentUser yang hilang ditambahkan di sini
const getCurrentUser = async () => {
    try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
            method: "GET",
            credentials: "include", // Penting agar cookie session terkirim
        });

        if (res.ok) {
            const data = await res.json();
            // Simpan ke localStorage agar UI lain bisa akses cepat jika perlu
            localStorage.setItem("user", JSON.stringify(data.user));
            return data.user;
        } else {
            // Jika session tidak valid atau error, hapus data user lama
            localStorage.removeItem("user");
            return null;
        }
    } catch (err) {
        console.error("Error fetching current user:", err);
        localStorage.removeItem("user");
        return null;
    }
};

// ✅ 3. Fungsi logout yang hilang ditambahkan di sini
const logout = async () => {
    try {
        await fetch("http://localhost:5000/api/auth/logout", {
            method: "POST",
            credentials: "include", // Kirim cookie untuk menghapus session di backend
        });
    } finally {
        // Apapun hasilnya, bersihkan sisi klien
        localStorage.removeItem("user");
        window.location.href = "/"; // Redirect ke homepage
    }
};


const Sidebar = ({children, bg, left, hideSidebar}) => {
    const result = Children.toArray(children);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // ✅ 4. State loading yang hilang

    const fetchUser = async () => {
        try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            console.error("Error fetching user:", error);
            setUser(null);
        } finally {
            setLoading(false); // Pastikan setLoading dipanggil
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleLogout = async () => {
        const result = await Swal.fire({
          icon: "question",
          title: "Yakin mau logout?",
          showCancelButton: true,
          confirmButtonText: "Ya, Logout",
          cancelButtonText: "Batal",
          confirmButtonColor: '#8B5CF6'
        });
    
        if (result.isConfirmed) {
          try {
            await logout(); // Fungsi ini sekarang sudah ada
            
            // Swal tidak akan sempat tampil karena halaman akan di-redirect,
            // tapi tidak apa-apa jika tetap ada.
            Swal.fire({
              icon: "success",
              title: "Berhasil logout!",
              timer: 1500,
              showConfirmButton: false,
            });
          } catch (error) {
            console.error("Logout error:", error);
            window.location.href = "/"; // Fallback redirect
          }
        }
    };

    return(
        <div 
            className={`${bg} text-my-text dark:text-my-text-dark absolute w-screen h-full text-2xl font-medium transition-all ease-out box-border`} 
            onClick={hideSidebar}
        >
            <div className="h-screen p-5 sticky top-0">
                <div 
                    className={`bg-my-bg dark:bg-my-bg-dark flex flex-col justify-between h-full box-border w-fit p-3 pe-6 rounded-xl ${left} transition-all ease-out`} 
                    onClick={(event) => event.stopPropagation()}
                >
                    {/* exit button */}
                    <div className="w-fit">{result[0]}</div>

                    {/* navigation */}
                    <div className="flex flex-col gap-5">
                        <NavLink to='/'><div className='hover:text-primary dark:hover:text-primary-dark'>Beranda</div></NavLink>
                        <NavLink to='/ruang-belajar'><div className='hover:text-primary dark:hover:text-primary-dark'>Ruang Belajar</div></NavLink>
                        <NavLink to='/ruang-kelas'><div className='hover:text-primary dark:hover:text-primary-dark'>Ruang Kelas</div></NavLink>
                        <NavLink to='/chatbot'><div className='hover:text-primary dark:hover:text-primary-dark'>ChatBot</div></NavLink>
                        <NavLink to='/profile'><div className='hover:text-primary dark:hover:text-primary-dark'>Profile</div></NavLink>
                    </div>

                    <div className="space"></div>
                    <div className="space"></div>

                    <div className="text-2xl font-medium">
                        {result[1]}
                        {/* Selama loading, kita bisa tampilkan placeholder */}
                        {loading ? (
                            <div className="px-4 py-2 text-gray-400">Loading...</div>
                        ) : user ? (
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Sign Out
                            </button>
                        ) : (
                            <div className="mb-5">    
                                <NavLink
                                    to='/login'
                                    className="w-full text-left px-4 py-2 text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    Login
                                </NavLink>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;