import { useState } from "react";
import React from 'react';

const DarkModeButton = ({
    // text='Dark mode', 
    icon='moon.svg', 
    iconSize=20, 
    handleClick
  }) => {

  return(
    // button
    <div className="
      bg-primary text-my-text-dark
      dark:bg-primary-dark dark:text-my-text
      rounded px-3 py-1 w-fit flex gap-2 cursor-pointer items-center" 
      onClick={handleClick}
    >
      
      {/* icon */}
      <span>
          <img src={`/img/${icon}`} alt="" width={iconSize}/>
      </span>

      {/* text */}
      {/* <span>{text}</span> */}
        
    </div>
  );
}

export default DarkModeButton;