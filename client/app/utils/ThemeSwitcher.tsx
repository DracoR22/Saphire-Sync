'use client'

import { useState, useEffect } from 'react'
import { BiSun, BiMoon } from 'react-icons/bi'
import { useTheme } from 'next-themes'

const ThemeSwitcher = () => {

    const [hasMounted, setHasMounted] = useState(false);
    const {theme, setTheme} = useTheme()

    useEffect(() => {
        setHasMounted(true);
    }, [])
  
    if (!hasMounted) return null;
  
  return (
    <div className='flex items-center justify-center mx-4'>
      {theme === 'light' ? (
        <BiMoon className="cursor-pointer" fill="black" size={22} onClick={() => setTheme("dark")}/>
      ) : (
        <BiSun className="cursor-pointer" size={22} onClick={() => setTheme("light")}/>
      )}
    </div>
  )
}

export default ThemeSwitcher
