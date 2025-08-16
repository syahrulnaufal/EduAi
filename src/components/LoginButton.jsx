import React from "react";
import { NavLink } from "react-router";

function LoginButton() {
    return (
        <div className="flex items-center gap-2 box-border pe-4">
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
        </div>
    );
}

export default LoginButton;