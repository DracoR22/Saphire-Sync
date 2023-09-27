'use client'

import { styles } from "@/app/styles/style"
import Image from "next/image"
import { AiOutlineCamera } from "react-icons/ai"
import { useEffect, useState } from "react"
import { useEditProfileMutation, useUpdateAvatarMutation } from "@/redux/features/user/userApi"
import { useLoadUserQuery } from "@/redux/features/api/apiSlice"
import Button from "../Button"
import { toast } from 'react-toastify'
import { useRouter } from "next/navigation"

interface Props {
    avatar: string | null
    user: any
}

const ProfileInfo = ({ avatar, user }: Props) => {

const [isLoading, setIsLoading] = useState(false)

// NAME STATE
const [name, setName] = useState(user && user.name)

// GET UPDATE AVATAR MUTATION
const [updateAvatar, { isSuccess, error }] = useUpdateAvatarMutation()

// GET THE UPDATE USER MUTATION
const [editProfile, {isSuccess: success, error: updateError}] = useEditProfileMutation()

// GET LOAD USER QUERY
const [loadUser, setLoadUser] = useState(false)
const {refetch} = useLoadUserQuery(undefined, {refetchOnMountOrArgChange: true})

// UPDATE USER AVATAR
const imageHandler = async (e: any) => {

  const fileReader = new FileReader()

  fileReader.onload = () => {
    if(fileReader.readyState === 2) {
      const avatar = fileReader.result
       updateAvatar(avatar)
    }
  }
  fileReader.readAsDataURL(e.target.files[0])
}

// HANDLE SUCCESS AND ERRORS  
useEffect(() => {
  if(isSuccess) {
     setLoadUser(true)
     refetch()
  }
  if(error || updateError) {
    console.log(error)
  }

  if(success) {
    toast.success('Profile updated succesfully!')
    setLoadUser(true)
  }
}, [isSuccess, success, updateError, error])

// UPDATE USER NAME
const handleSubmit = async (e: any) => {
  setIsLoading(true)
    e.preventDefault()
    if(name !== "") {
     await editProfile({name: name})
    }
    setIsLoading(false)
}
    return (
        <>
          <div className="w-full flex justify-center">
            <div className="relative">
                {/*SEE AND CHANGE USER AVATAR */}
              <Image src={user.avatar || avatar ? user.avatar.url || avatar : "/profile.jpg"}
              alt="" className="w-[120px] h-[120px] cursor-pointer border-[3px] border-[#37a39a] rounded-full" width={120} height={120}/>

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
                  {/* CHANGE USER NAME */}
                   <label className="block pb-2">Full Name</label>
                   <input type="text" className={`${styles.input} !w-[95%] mb-1 800px:mb-0`}
                   required value={name} onChange={(e) => setName(e.target.value)}/>
                 </div>
                 <div className="w-[100%] pt-2">
                   <label className="block pb-2">Email Address</label>
                   <input type="text" readOnly className={`${styles.input} !w-[95%] mb-1 800px:mb-0`}
                   required value={user.email} />
                 </div>
                <Button value="Update" type="submit"
                 className={`flex flex-row justify-center items-center py-2 px-4 rounded-full cursor-pointer
                  bg-[#178582] hover:bg-[#3b9693] w-full 800px:w-[200px] mt-4 font-Poppins
                   font-semibold`} isLoading={isLoading}>
                  Update
                </Button>
               </div>
             </form>
          </div>
        </>
    )
}

export default ProfileInfo
