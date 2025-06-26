import React, { useEffect, useState } from "react";

const BurgerMenu = ({icon, handleClick})=>{

    // kurang ngganti icon waktu dark mode
    return(
        <div onClick={handleClick} className={`cursor-pointer rounded w-fit p-2 dark:hover:bg-surface/10 hover:bg-surface-dark/10`} >
           {icon}
        </div>
    );
}

export default BurgerMenu;