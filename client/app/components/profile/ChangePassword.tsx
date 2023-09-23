'use client'

import { styles } from "@/app/styles/style"
import { useState, useEffect } from "react"
import Button from "../Button"
import { useUpdatePasswordMutation } from "@/redux/features/user/userApi"
import { toast } from "react-toastify"

interface Props {
    
}

const ChangePassword = (props: Props) => {

 const [isLoading, setIsLoading] = useState(false)

 const [oldPassword, setOldPassword] = useState("")
 const [newPassword, setNewPassword] = useState("")
 const [confirmPassword, setConfirmPassword] = useState("")

 // GET CHANGE PASSWORD QUERY FROM REDUX
 const [updatePassword, {isSuccess, error}] = useUpdatePasswordMutation()

 // CHANGE USER PASSWORD
 const passwordChangeHandler = async (e: any) => {
    e.preventDefault()
    if(newPassword !== confirmPassword) {
        toast.error("Passwords do not match")
    } else {
        setIsLoading(true)
        await updatePassword({oldPassword, newPassword})
        setIsLoading(false)
    }
 }

 // HANDLE ERRORS AND SUCCESS
 useEffect(() => {
    if(isSuccess) {
        toast.success("Password changed succesfully")
    }
    if(error) {
        if("data" in error) {
            const errorData = error as any
            toast.error(errorData.data.message)
        }
    }
 }, [isSuccess, error])

    return (
        <div className="w-full pl-7 px-2 800px:px-5 800px:pl-0">
            <h1 className="block text-[25px] 800px:text-[30px] font-Poppins text-center font-[500] pb-2 dark:text-white text-black">
               Change Password
            </h1>
            <div className="w-full">
              <form aria-required onSubmit={passwordChangeHandler} className="flex flex-col items-center">
                <div className="w-[100%] 800px:w-[60%] mt-5">
                    {/* OLD PASSWORD */}
                  <label className="block pb-2 dark:text-white text-black">Enter your old password</label>
                  <input type="password" className={`${styles.input} !w-[95%] mb-4 800px:mb-0`} required
                  value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}/>
                </div>
                   {/* NEW PASSWORD */}
                <div className="w-[100%] 800px:w-[60%] mt-2">
                  <label className="block pb-2 dark:text-white text-black">Enter your new password</label>
                  <input type="password" className={`${styles.input} !w-[95%] mb-4 800px:mb-0`} required
                  value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
                </div>
                <div className="w-[100%] 800px:w-[60%] mt-2">
                    {/* CONFIRM NEW PASSWORD */}
                <label className="block pb-2 dark:text-white text-black">Confirm your new password</label>
                <input type="password" className={`${styles.input} !w-[95%] mb-4 800px:mb-0`} required
                  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                   <Button className={`flex flex-row justify-center items-center py-2 px-4 rounded-full cursor-pointer
                     bg-[#00df9a] hover:bg-[#3b9693] w-[95%]  mt-4 font-Poppins font-semibold`}
                     isLoading={isLoading}>
                         Update
                  </Button>
                </div>
              </form>
            </div>
        </div>
    )
}

export default ChangePassword
