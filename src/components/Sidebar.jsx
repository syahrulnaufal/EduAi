import React from "react";
import { Children } from "react";
import { NavLink } from "react-router";

const Sidebar = ({children, bg, left, hideSidebar}) => {

    const result = Children.toArray(children);

    return(
        <div className={`
            ${bg}
            text-my-text dark:text-my-text-dark
            w-screen h-screen absolute text-2xl font-medium p-5 transition-all ease-out box-border
        `} onClick={hideSidebar}>
            <div className={` 
                bg-my-bg
                dark:bg-my-bg-dark
                flex flex-col justify-between h-full box-border w-fit p-3 pe-6 rounded-xl relative ${left} transition-all ease-out
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

                {/* just for space */}
                <div className="space"></div>
                <div className="space"></div>

                {/* darkmode button */}
                <div className="text-2xl font-medium">
                    {result[1]}
                </div>

            </div>
        </div>
    );
}

export default Sidebar