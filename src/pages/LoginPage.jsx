import Topbar from "../components/Topbar";
import '../style.css'; 
import Sidebar from "../components/Sidebar";
import BurgerMenu from "../components/BurgerMenu";
import { NavLink,useNavigate } from "react-router";
import { useState, useEffect } from "react";

function LoginPage(){
    // Sidebar 
    const [left, setLeft] = useState('-left-70') 
    const [bg, setBg] = useState('bg-transparent -z-10')
    const [isSidebarHidden, setIsSidebarHidden] = useState(true)
    const iconSize = '20px'
    const menuButton = <svg xmlns="http://www.w3.org/2000/svg" id='menu' height={iconSize} viewBox="0 -960 960 960" width={iconSize} className="fill-my-text dark:fill-my-text-dark"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>
    const closeButton = <svg xmlns="http://www.w3.org/2000/svg" id='close' height={iconSize} viewBox="0 -960 960 960" width={iconSize} className="fill-my-text dark:fill-my-text-dark"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>;
    const [menuIcon, setMenuIcon] = useState(isSidebarHidden? menuButton : closeButton)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    //password
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    
    // function to hide unhide input password
    function togglePasswordVisibility() {
        setIsPasswordVisible(!isPasswordVisible);
    }
    
    // Function to hide the sidebar
    function hideSidebar (){
        if(isSidebarHidden){
            setLeft('left-0')
            setBg('bg-my-bg-dark/70 z-20')
            setIsSidebarHidden(false)
            setMenuIcon(closeButton)
          }else{
            setLeft('-left-70')
            setIsSidebarHidden(true)
            setBg('bg-transparent -z-10')
            setMenuIcon(menuButton)
        }
    }
    const handleLogin = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include", // biar cookie session ikut
    });

    const data = await res.json();
    console.log("Login response body:", data);

    if (res.ok) {
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: data.message || "Login sukses",
        confirmButtonText: "OK",
      }).then(() => {
        // cek role user
        if (data.user.role === "admin") {
          window.location.href = "http://localhost:5173/admin.html#";
        } else {
          window.location.href = "http://localhost:5173/";
        }
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: data.message || "Login gagal",
      });
    }
  } catch (err) {
    console.error("Login error:", err);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Terjadi kesalahan pada server",
    });
  }
};


const getCurrentUser = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/auth/me", {
      method: "GET",
      credentials: "include", // cookie wajib ikut
    });

    const data = await res.json();
    console.log("User session:", data);

    if (res.ok) {
      // Simpan user ke localStorage supaya UI bisa akses cepat
      localStorage.setItem("user", JSON.stringify(data.user));
      return data.user;
    } else {
      // kalau session invalid
      localStorage.removeItem("user");
      Swal.fire({
        icon: "warning",
        title: "Session Habis",
        text: "Silahkan login ulang!",
        confirmButtonText: "Login"
      }).then(() => {
        window.location.href = "http://localhost:5173/login";
      });
      return null;
    }
  } catch (err) {
    console.error("Error fetching /me:", err);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Terjadi kesalahan pada server",
    });
    return null;
  }
};

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  // ✅ CEK QUERY STRING setelah redirect dari Google
 useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const id_user = params.get("id_user");
  const username = params.get("username");
  const email = params.get("email");
  const role = params.get("role");

  if (id_user && username && email) {
    const userData = { id_user, username, email, role };
    localStorage.setItem("user", JSON.stringify(userData));

    // hapus query string biar rapi
    window.history.replaceState({}, document.title, "/login");

    Swal.fire({
      icon: "success",
      title: "Login Google Berhasil!",
      text: `Selamat datang, ${username}`,
      confirmButtonText: "OK",
    }).then(() => {
      if (role === "admin") {
        window.location.href = "http://localhost:5173/admin.html#";
      } else {
        window.location.href = "http://localhost:5173/";
      }
    });
  }
}, []);





    return(
        <div>
            <Sidebar 
                className='absolute'
                hideSidebar={hideSidebar} 
                left={left} 
                bg={bg}
            >
                <BurgerMenu icon={menuIcon} handleClick={hideSidebar}/>
            </Sidebar>

            <Topbar>
                <BurgerMenu icon={menuIcon} handleClick={hideSidebar}/>
                <div></div>
            </Topbar>

            {/* main */}
            <div className="w-screen h-screen flex flex-col items-center justify-center " style={{background: '#D2BCE5',
background: 'linear-gradient(45deg, rgba(210, 188, 229, 1) 0%, rgba(255, 255, 255, 1) 50%, rgba(206, 158, 247, 1) 100%)'}}>

                {/* box putih utama */}
                <div className="w-100 h-fit rounded-2xl flex flex-col bg-white" style={{boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'}}>
                    
                    {/* text ungu */}
                    <div className="w-full text-center py-4 bg-[#5852AB] rounded-t-2xl font-bold text-2xl text-white">Login</div>
                    
                    <div className="flex flex-col p-6 px-8 gap-4">

                        {/*  email dan passsword */}
                        <div className="flex gap-2 border border-gray-400 rounded-sm">
                            <img src="/img/email.png" alt="email" className="w-10 p-2"/>
                            <input type="email" placeholder="Email" className=" p-2 w-full focus:outline-none" value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="flex gap-2 border border-gray-400 rounded-sm relative">
                            <img src="/img/password.png" alt="kata sandi" className="w-10 p-2 "/>
                            <input type={isPasswordVisible? 'text' : 'password'}  placeholder="Kata Sandi" className=" p-2 w-full focus:outline-none " value={password}
                            onChange={(e) => setPassword(e.target.value)}  />
                            <div className="w-fit h-full flex items-center justify-center pe-2">
                                <img src={isPasswordVisible ? "/img/show.png" : "/img/hide.png"} onClick={togglePasswordVisibility} className="w-8 h-7"/>
                            </div>
                        </div>
                        <div className="text-end leading-0.5 mb-1 text-[#1C58B4] cursor-pointer hover:text-[#3f6bad] text-sm">
                           <span onClick={()=>{alert("Makanya Password jangan sampe Lupa !!")}}><NavLink>lupa password?</NavLink></span>
                        </div>

                        {/* green button */}
                        <button 
                        onClick={handleLogin} 
                        className="p-2 mt-2 text-xl font-semibold text-center rounded-sm text-white bg-[#00AF34] hover:bg-[#2ca450] active:bg-[#03942e] tracking-normal cursor-pointer transition-colors duration-150">
                        Login
                        </button>


                        {/* text atau */}
                        <div className="flex items-center justify-center w-full relative">
                            <div className=" bg-gray-400 h-[1px] w-full"></div>
                            <div className="absolute bg-white px-1 text-gray-500">atau</div>
                        </div>

                        {/* daftar dengan google */}
                        <div onClick={handleGoogleLogin} className="w-full border border-gray-400 rounded-sm relative text-center p-2 mb-4 cursor-pointer hover:bg-gray-50">
                            <img src="/img/google.png" alt="Daftar dengan Google" className="w-8 ps-2 absolute" />
                            Login dengan Google
                        </div>

                        <div className="text-sm">Belum punya akun? <span className="text-[#1C58B4] hover:text-[#3f6bad] cursor-pointer">
                            <NavLink to="/sign-in">Masuk</NavLink>
                        </span></div>

                    </div>
                </div>
                
                <div className="h-20"></div>
            </div>
        </div>
    );
}

export default LoginPage;