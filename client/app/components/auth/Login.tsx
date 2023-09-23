'use client'

import { useFormik } from "formik"
import * as Yup from "yup"
import { AiOutlineEye, AiOutlineEyeInvisible, AiFillGithub } from 'react-icons/ai'
import { FcGoogle } from "react-icons/fc"
import { useEffect, useState } from 'react'
import { styles } from "@/app/styles/style"
import { useLoginMutation } from "@/redux/features/auth/authApi"
import { toast } from "react-toastify"
import { signIn } from "next-auth/react"
import Button from "../Button"

type Props = {
    setRoute: (route: string) => void
    setOpen: (open: boolean) => void
}

const schema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Please enter your email"),
    password: Yup.string().required("Please enter your password").min(6)
})

const Login = ({ setRoute, setOpen }: Props) => {

  const [show, setShow] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Call login mutation
  const [login, {isSuccess, error}] = useLoginMutation()

   // Create and submit our form
  const formik = useFormik({
    initialValues: {
        email: '',
        password: ''
    },
    validationSchema: schema,
    onSubmit: async({email, password}) => {
      setIsLoading(true)
       // login user
       await login({email, password})
       setIsLoading(false)
    }
  })

  // Handle api errors and success
  useEffect(() => {
   if(isSuccess) {
    toast.success("Login succesfully!")
    setOpen(false)
   }
   if(error) {
    if ("data" in error) {
      const errorData = error as any
      toast.error(errorData.data.message);
  }
   }
  }, [isSuccess, error])

  const { errors, touched, values, handleChange, handleSubmit } = formik

  return (
    <div className="w-full">
      <h1 className={`${styles.title}`}>
        Login to Sapphire
      </h1>
      <form onSubmit={handleSubmit}>
        {/* EMAIL FIELD */}
        <label className={`${styles.label}`} htmlFor="email">
          Enter your Email
        </label>
        <input type="email" value={values.email} onChange={handleChange} id="email" name="email"
         placeholder="loginmail@gmail.com" className={`${errors.email && touched.email && "border-rose-500"}
          ${styles.input}`}/>
          {errors.email && touched.email && (
            <span className="text-rose-500 pt-2 block">{errors.email}</span>
          )}
          <div className="w-full mt-5 relative mb-1">
        {/* PASSWORD FIELD */}
          <label className={`${styles.label}`} htmlFor="password">
           Enter your password
          </label>
          <input type={!show ? "password" : "text"} value={values.password} onChange={handleChange} id="password"
           placeholder="password!@%" name="password"
            className={`${errors.password && touched.password && "border-rose-500"}
          ${styles.input}`}/>
          {!show ? (
            <AiOutlineEyeInvisible className="absolute bottom-3 right-2 z-1 cursor-pointer" 
            size={20} onClick={() => setShow(true)}/>
          ) : (
            <AiOutlineEye className="absolute bottom-3 right-2 z-1 cursor-pointer" 
            size={20} onClick={() => setShow(false)}/>
          )}
          </div>
          {errors.password && touched.password && (
            <span className="text-rose-500 pt-2 block">{errors.email}</span>
          )}
          <div className="w-full mt-5">
            <Button value="Login" type="submit" className={`${styles.button}`} isLoading={isLoading}>
              Login
            </Button>
          </div>
          <br />
          <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
            Or join with
          </h5>
          <div className="flex items-center justify-center my-3">
           <FcGoogle size={30} className="cursor-pointer mr-2" 
           onClick={() => signIn("google")}/>
           <AiFillGithub size={30} className="cursor-pointer ml-2 text-black dark:text-white"
           onClick={() => signIn("github")}/>
          </div>
         <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
           Dont have an account yet?{" "}
           <span className="text-[#BFA181] pl-1 cursor-pointer" onClick={() => setRoute("Sign-Up")}>
             Sign Up
           </span>
         </h5>
      </form>
      <br />
    </div>
  )
}

export default Login
