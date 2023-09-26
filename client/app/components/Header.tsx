'use client'

import Link from "next/link"
import { useState, useEffect } from "react"
import NavItems from "../utils/NavItems"
import ThemeSwitcher from "../utils/ThemeSwitcher"
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi"
import Image from "next/image"
import CustomModal from "../utils/CustomModal"
import Login from "./auth/Login"
import SignUp from "./auth/SignUp"
import Verification from "./auth/Verification"
import { useSelector } from "react-redux"
import { useSession } from 'next-auth/react'
import { useLogOutQuery, useSocialAuthMutation } from "@/redux/features/auth/authApi"
import { toast } from "react-toastify"
import { useLoadUserQuery } from "@/redux/features/api/apiSlice"

type Props = {
    open: boolean
    setOpen: (open: boolean) => void
    activeItem: number
    route: string
    setRoute: (route: string) => void
}

const Header = ({open, setOpen, activeItem, route, setRoute}: Props) => {

  const [active, setActive] = useState(false)
  const [openSidebar, setOpenSidebar] = useState(false)
  const {data:userData, isLoading, refetch} = useLoadUserQuery(undefined,{});
  const [logout, setLogout] = useState(false)

  // Get User
  const { user }  = useSelector((state: any)  => state.auth)

  // Get Session
  const { data } = useSession()
  const [socialAuth, {isSuccess, error}] = useSocialAuthMutation()

  //Get Logout Function
  const {} = useLogOutQuery(undefined, {
   skip: !logout ? true : false
  })

  useEffect(() => {
    if(!isLoading){
      if (!userData) {
        if (data) {
          socialAuth({
            email: data?.user?.email,
            name: data?.user?.name,
            avatar: data.user?.image,
          });
          refetch();
        }
      }
      if(data === null){
        if(isSuccess){
          toast.success("Logged In Successfully");
        }
      }
      if(data === null && !isLoading && !userData){
          setLogout(true);
      }
    }
  }, [data, userData,isLoading]);


  if(typeof window !== 'undefined') {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 85) {
            setActive(true)
        } else {
            setActive(false)
        }
    })
  }

  const handleClose = (e: any) => {
    if(e.target.id === "screen") {
        {setOpenSidebar(false)}
    }
  }

  return (
    <div className="w-full relative">
      <div className={`${active ? `dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900
       dark:to-black bg-white fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#BFA181]
        shadow-xl transition duration-500` :
         `w-full border-b dark:border-[#BFA181] h-[80px] z-[80] dark:shadow`}`}>
        <div className="w-[95%] 800px:w-[92%] m-auto py-2 h-full">
          <div className="w-full h-[80px] flex items-center justify-between p-3">
            <div>
                <Link href='/' className={`text-[25px] font-Poppins font-[500] text-black dark:text-white`}>
                 Sapphire
                </Link>
            </div>
            <div className="flex items-center">
              <NavItems activeItem={activeItem} isMobile={false}/>
              <ThemeSwitcher/>
              <div className="800px:hidden">
                <HiOutlineMenuAlt3 size={22} className="cursor-pointer dark:text-white text-black"
                onClick={() => setOpenSidebar(true)}/>
              </div>
            {user ? (
              <>
               <Link href='/profile'>
               <Image src={user.avatar || user.avatar ? user.avatar.url || user.avatar : "/profile.jpg"} alt={user.name} width={30} height={30} className="w-[30px] h-[30px] rounded-full cursor-pointer"
               style={{border: activeItem === 4 ? "2px solid #00df9a" : "none"}}/>
               </Link>
              </>
            ) : (
              <HiOutlineUserCircle size={25} className="cursor-pointer dark:text-white text-black hidden 800px:block"
              onClick={() => setOpen(true)}/>
            )}
            </div>
          </div>
        </div>
        {/* MOBILE SIDEBAR */}
        {openSidebar && (
            <div className="fixed flex 800px:hidden w-full h-screen top-0 left-0 z-[99999] dark:bg-[unset] bg-[#00000024]"
            onClick={handleClose} id="screen">
              <div className="w-[70%] fixed z-[999999999] h-screen bg-white dark:bg-gray-900 top-0 right-0">
                <NavItems activeItem={activeItem} isMobile={true}/>
                <HiOutlineUserCircle size={25} className="cursor-pointer ml-5 my-2 dark:text-white text-black"
              onClick={() => setOpen(true)}/>
              <br />
              <br />
              <p className="text-[16px] px-2 pl-5 text-black dark:text-white">
                Copyright © 2023 Sapphire
              </p>
              </div>
            </div>
        )}
      </div>
      {route === "Sign-Up" && (
        <>
          {open && (
          <CustomModal open={open} setOpen={setOpen} setRoute={setRoute} activeItem={activeItem} 
          Component={SignUp}/>
         )}
        </>
      )}
      {route === "Login" && (
        <>
         {open && (
          <CustomModal open={open} setOpen={setOpen} setRoute={setRoute} activeItem={activeItem} 
          Component={Login} refetch={refetch}/>
         )}
        </>
      )}

      {route === "Verification" && (
        <>
         {open && (
          <CustomModal open={open} setOpen={setOpen} setRoute={setRoute} activeItem={activeItem} 
          Component={Verification} refetch={refetch}/>
         )}
        </>
      )}
    </div>
  )
}

export default Header
