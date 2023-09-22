import { styles } from "@/app/styles/style"
import Image from "next/image"
import { AiOutlineCamera } from "react-icons/ai"
import { useState } from "react"

interface Props {
    avatar: string | null
    user: any
}

const ProfileInfo = ({ avatar, user }: Props) => {

const [name, setName] = useState(user && user.name)

const imageHandler = async (e: any) => {

}

const handleSubmit = async (e: any) => {
    
}
    return (
        <>
          <div className="w-full flex justify-center">
            <div className="relative">
                {/* AVATAR */}
              <Image src={user.avatar || avatar ? user.avatar.url || avatar : "/profile.jpg"}
              alt="" className="cursor-pointer border border-[#37a39a] rounded-full" width={120} height={120}/>
              <input type="file" name="" id="avatar" className="hidden" onChange={imageHandler}
               accept="image/png,image/jpg,image/jpeg,image/webp"/>
               <label htmlFor="avatar">
                 <div className="w-[30px] h-[30px] bg-slate-900 rounded-full absolute bottom-2 right-2 flex
                 items-center justify-center cursor-pointer">
                   <AiOutlineCamera size={20} className="z-1"/>
                 </div>
               </label>
            </div>
          </div>
          <br />
          <br />
          <div className="w-full pl-6 800px:pl-10">
             <form onSubmit={handleSubmit}>
               <div className="800px:w-[50%] m-auto block pb-4">
                 <div className="w-[100%]">
                   <label className="block pb-2">Full Name</label>
                   <input type="text" readOnly className={`${styles.input} !w-[95%] mb-1 800px:mb-0`}
                   required value={name} onChange={(e) => setName(e.target.value)}/>
                 </div>
                 <div className="w-[100%] pt-2">
                   <label className="block pb-2">Email Address</label>
                   <input type="text" readOnly className={`${styles.input} !w-[95%] mb-1 800px:mb-0`}
                   required value={user.email} />
                 </div>
                 <input className={`w-full 800px:w-[250px] h-[40px] bg-[#37a39a] text-center
                 dark:text-white text-black rounded-full mt-8 cursor-pointer flex justify-center`} 
                 required value="Update" type="submit"/>
               </div>
             </form>
          </div>
        </>
    )
}

export default ProfileInfo
