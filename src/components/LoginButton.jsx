
import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router";
import { getCurrentUser, logout } from "../services/authservice";

function UserIcon({ size = 20 }) {
  const s = size;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block"
    >
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M4 20c0-3.3137 2.6863-6 6-6h4c3.3137 0 6 2.6863 6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Component for user avatar with profile image or initials
function UserAvatar({ user, size = 32 }) {
  const getUserInitials = (username) => {
    if (!username) return "U";
    const names = username.split(' ');
    if (names.length >= 2) {
      return names[0][0].toUpperCase() + names[1][0].toUpperCase();
    }
    return username[0].toUpperCase();
  };

  const getAvatarColor = (username) => {
    const colors = [
      'bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-red-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'
    ];
    const index = username ? username.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  if (user?.profile_image) {
    return (
      <div className={`w-${size} h-${size} rounded-full overflow-hidden bg-gray-200 flex-shrink-0`} style={{width: `${size}px`, height: `${size}px`}}>
        <img 
          src={user.profile_image} 
          alt="Profile" 
          className="w-full h-full object-cover"
          onError={(e) => {
            // If image fails to load, hide it and show initials
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div 
          className={`w-full h-full ${getAvatarColor(user?.username || user?.name)} text-white flex items-center justify-center text-sm font-bold`}
          style={{display: 'none'}}
        >
          {getUserInitials(user?.username || user?.name)}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`w-${size} h-${size} ${getAvatarColor(user?.username || user?.name)} rounded-full text-white flex items-center justify-center text-sm font-bold flex-shrink-0`}
      style={{width: `${size}px`, height: `${size}px`}}
    >
      {getUserInitials(user?.username || user?.name)}
    </div>
  );
}

function LoginButton() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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
    
    // Listen for profile updates
    const handleProfileUpdate = () => {
      fetchUser();
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

return (
    <div className="flex items-center gap-2 box-border pe-4 relative">
      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : !user ? (
        <>
          <NavLink to="/login">
            <button
              className="bg-my-bg text-base text-my-text cursor-pointer
                    hover:bg-my-blue/10 px-8 py-2 rounded-4xl border border-my-border transition duration-200"
            >
              Masuk
            </button>
          </NavLink>
          <NavLink to="/sign-in">
            <button
              className="bg-[#9E88EE] text-base text-white cursor-pointer
                    hover:bg-[#8c71ed] px-8 py-2 rounded-4xl transition duration-200"
            >
              Daftar
            </button>
          </NavLink>
        </>
      ) : (
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-3 px-4 py-2 rounded-4xl bg-my-bg border border-my-border hover:bg-my-blue/10 transition duration-200"
            aria-haspopup="true"
            aria-expanded={open}
          >
            <UserAvatar user={user} size={32} />
            <span className="text-my-text text-base truncate max-w-[8rem]">
              {user?.name || user?.username || "User"}
            </span>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 z-50">
              <NavLink
                to="/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default LoginButton;