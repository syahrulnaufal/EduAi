import React from "react";
import { NavLink } from "react-router";
import '../style.css'
import { Children } from "react";
import { useState } from "react";

function Topbar({children}) {

    const elements = Children.toArray(children);

    return(
    <div className="flex items-center justify-between bg-surface px-4 h-15 border-b border-my-border 
    dark:bg-my-bg-dark dark:text-my-text-dark dark:border-my-border-dark
    ">
        <div className="flex items-center w-fit gap-4">
            <img src="/logo.png" alt="Chatbot Logo" className="h-8 px-3 " />
            <div className="w-10"></div>

            {/* navigation */}
            <div className="hideAtMobile flex gap-4">
                <NavLink to='/'>
                    <div className='hover:text-primary dark:hover:text-primary-dark'>Beranda</div>
                </NavLink>
                <NavLink to='/ruang-belajar'>
                    <div className='hover:text-primary dark:hover:text-primary-dark'>Ruang Belajar</div>
                </NavLink>
                <NavLink to='/brain-academy'>
                    <div className='hover:text-primary dark:hover:text-primary-dark'>Brain Academy</div>
                </NavLink>
                <NavLink to='/ruang-kelas'>
                    <div className='hover:text-primary dark:hover:text-primary-dark'>Ruang Kelas</div>
                </NavLink>
                <NavLink to='/chatbot'>
                    <div className='hover:text-primary dark:hover:text-primary-dark'>ChatBot</div>
                </NavLink>
                <NavLink to='/tentang'>
                    <div className='hover:text-primary dark:hover:text-primary-dark'>Tentang</div>
                </NavLink>
            </div>      

        </div>

        {/* burgermenu only shown on small screen */}
        <div className="flexAtMobile hidden items-center gap-4">
            {children[0]}
        </div>

        {/* login button */}
        <div className="hideAtMobile items-center gap-4 flex">
            {/* child element */}
            {elements[1]}
        </div>


    </div>
    );
}

export default Topbar;
