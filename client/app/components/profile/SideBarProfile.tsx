import Image from "next/image"
import { AiOutlineLogout } from "react-icons/ai"
import { RiLockPasswordLine } from "react-icons/ri"
import { SiCoursera } from "react-icons/si"
import { MdOutlineAdminPanelSettings } from "react-icons/md"
import Link from "next/link"

interface Props {
    user: any
    active: number
    avatar: string | null
    setActive: (active: number) => void
    logOutHandler: any
}

const SideBarProfile = ({ user, active, avatar, setActive, logOutHandler }: Props) => {
    return (
        <div className="w-full">
            <div className={`w-full flex items-center px-3 py-4 cursor-pointer hover:bg-neutral-300 dark:hover:bg-slate-800 transition ${active === 1 ? 
            "dark:bg-slate-800 bg-white" : "bg-transparent"}`} onClick={() => setActive(1)}>
               <Image src={user.avatar || avatar ? user.avatar.url || avatar : "/profile.jpg"} alt=""
               width={20} height={20} className="800px:w-[30px] 800px:h-[30px] cursor-pointer rounded-full"/>
               <h5 className="pl-2 hidden 800px:block font-Poppins text-black dark:text-white">
                  My Account
               </h5>
            </div>
            <div className={`w-full flex items-center px-3 py-4 cursor-pointer hover:bg-neutral-300 dark:hover:bg-slate-800 transition ${active === 2 ? 
            "dark:bg-slate-800 bg-white" : "bg-transparent"}`} onClick={() => setActive(2)}>
                <RiLockPasswordLine size={20} className="text-black dark:text-white"/>
                <h5 className="pl-2 hidden 800px:block font-Poppins text-black dark:text-white">
                    Change Password
                </h5>
            </div>
            <div className={`w-full flex items-center px-3 py-4 cursor-pointer hover:bg-neutral-300 dark:hover:bg-slate-800 transition ${active === 3 ? 
            "dark:bg-slate-800 bg-white" : "bg-transparent"}`} onClick={() => setActive(3)}>
                <SiCoursera size={20} className="text-black dark:text-white"/>
                <h5 className="pl-2 hidden 800px:block font-Poppins text-black dark:text-white">
                    Enrolled Courses
                </h5>
            </div>
              {user.role === "admin" && (
                     <Link className={`w-full flex items-center px-3 py-4 cursor-pointer hover:bg-neutral-300 dark:hover:bg-slate-800 transition ${active === 6 ? 
                    "dark:bg-slate-800 bg-white" : "bg-transparent"}`} href="/admin">
                        <MdOutlineAdminPanelSettings size={20} className="text-black dark:text-white"/>
                        <h5 className="pl-2 hidden 800px:block font-Poppins text-black dark:text-white">
                            Admin Dashboard
                        </h5>
                    </Link>
              )}
            <div className={`w-full flex items-center px-3 py-4 cursor-pointer hover:bg-neutral-300 dark:hover:bg-slate-800 transition ${active === 4 ? 
            "dark:bg-slate-800 bg-white" : "bg-transparent"}`} onClick={() => logOutHandler()}>
                <AiOutlineLogout size={20} className="text-black dark:text-white"/>
                <h5 className="pl-2 hidden 800px:block font-Poppins text-black dark:text-white
                 ">
                    Log Out
                </h5>
            </div>
        </div>
    )
}

export default SideBarProfile
