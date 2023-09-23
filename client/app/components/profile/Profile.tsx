'use client'

import { useState } from "react"
import SideBarProfile from "./SideBarProfile"
import { useLogOutQuery } from "@/redux/features/auth/authApi"
import { signOut } from "next-auth/react"
import { redirect } from "next/navigation"
import ProfileInfo from "./ProfileInfo"
import ChangePassword from "./ChangePassword"

interface Props {
    user: any
}

const Profile = ({ user }: Props) => {

   const [scroll, setScroll] = useState(false)
   const [avatar, setAvatar] = useState(null)
   const [logout, setLogout] = useState(false)

   //Get Logout Function
   const {} = useLogOutQuery(undefined, {
    skip: !logout ? true : false
   })

   const [active, setActive] = useState(1)

   const logOutHandler = async () => {
       setLogout(true)
       await signOut()
   }

  if(typeof window !== 'undefined') {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 85) {
            setScroll(true)
        } else {
            setScroll(false)
        }
    })
  }

    return (
        <div className="w-[85%] flex mx-auto">
            <div className={`w-[60px] 800px:w-[310px] h-[450px] dark:bg-[#0A1828] bg-white bg-opacity-90 border
             border-[#BFA181] rounded-[5px] shadow-sm my-[80px] sticky
              ${scroll ? "top-[120px]" : "top-[30px]"} left-[30px]`}>
               <SideBarProfile user={user} active={active} avatar={avatar}
                setActive={setActive} logOutHandler={logOutHandler}/>
            </div>
            {active === 1 && (
                    <div className="w-full h-full bg-transparent mt-[80px]">
                        <ProfileInfo avatar={avatar} user={user}/>
                    </div>
                )}
                {active === 2 && (
                    <div className="w-full h-full bg-transparent mt-[80px]">
                        <ChangePassword/>
                    </div>
                )}
        </div>
    )
}

export default Profile
