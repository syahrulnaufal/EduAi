import React from "react";
import { Children } from "react";
import { NavLink } from "react-router";
import { useState, useEffect } from "react";

const Sidebar = ({children, bg, left, hideSidebar}) => {

    const result = Children.toArray(children);
    const [user, setUser] = useState(null);

    const fetchUser = async () => {
        try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    // handle logout available to this component
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
            await logout(); // This will redirect to homepage
            
            Swal.fire({
              icon: "success",
              title: "Berhasil logout!",
              timer: 1500,
              showConfirmButton: false,
            });
          } catch (error) {
            console.error("Logout error:", error);
            // Even if API fails, redirect to homepage
            window.location.href = "/";
          }
        }
      };

    return(
        <div className={`
            ${bg}
            text-my-text dark:text-my-text-dark absolute 
            w-screen h-full text-2xl font-medium transition-all ease-out box-border
        `} onClick={hideSidebar}>
            <div className="h-screen p-5 sticky top-0">
                <div className={` 
                    bg-my-bg
                    dark:bg-my-bg-dark
                    flex flex-col justify-between h-full box-border w-fit p-3 pe-6 rounded-xl ${left} transition-all ease-out
                `} onClick={(event)=>{event.stopPropagation()}}>

                    {/* exit button */}
                    <div className=" w-fit">
                        {result[0]}
                    </div>

                    {/* navigation */}
                    <div className="flex flex-col gap-5">
                        <NavLink to='/'>
                            <div className='hover:text-primary dark:hover:text-primary-dark'>Beranda</div>
                        </NavLink>
                        <NavLink to='/ruang-belajar'>
                            <div className='hover:text-primary dark:hover:text-primary-dark'>Ruang Belajar</div>
                        </NavLink>
                        {/* <NavLink to='/brain-academy'>
                            <div className='hover:text-primary dark:hover:text-primary-dark'>Brain Academy</div>
                        </NavLink> */}
                        <NavLink to='/ruang-kelas'>
                            <div className='hover:text-primary dark:hover:text-primary-dark'>Ruang Kelas</div>
                        </NavLink>
                        <NavLink to='/chatbot'>
                            <div className='hover:text-primary dark:hover:text-primary-dark'>ChatBot</div>
                        </NavLink>
                        <NavLink to='/profile'>
                            <div className='hover:text-primary dark:hover:text-primary-dark'>Profile</div>
                        </NavLink>
                    </div>

                    {/* just for space */}
                    <div className="space"></div>
                    <div className="space"></div>

                    {/* darkmode button */}
                    <div className="text-2xl font-medium">
                        {result[1]}
                        {user ? (
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                            >
                                Sign Out
                            </button>
                        ) : (
                            <div className="mb-5">    
                                <NavLink
                                    to='/login'
                                    className="w-full text-left px-4 py-2 text-blue-600 hover:bg-gray-100"
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

export default Sidebar