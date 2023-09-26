'use client'

import { useFormik } from "formik"
import * as Yup from "yup"
import { AiOutlineEye, AiOutlineEyeInvisible, AiFillGithub } from 'react-icons/ai'
import { FcGoogle } from "react-icons/fc"
import { useState, useEffect } from 'react'
import { styles } from "@/app/styles/style"
import { useRegisterMutation } from "@/redux/features/auth/authApi"
import { toast } from "react-toastify"
import { signIn } from "next-auth/react"
import Button from "../Button"

type Props = {
    setRoute: (route: string) => void
}

const schema = Yup.object().shape({
    name: Yup.string().required("Please enter your name"),
    email: Yup.string().email("Invalid email").required("Please enter your email"),
    password: Yup.string().required("Please enter your password").min(6)
})

const SignUp = ({ setRoute }: Props) => {

  const [show, setShow] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Call register mutation
  const [register, {data, error, isSuccess}] = useRegisterMutation()

   // Handle api errors and success
  useEffect(() => {
    if(isSuccess) {
      const message = data?.message || "Registration successful"
      toast.success('A verification code has been sent to your email!');
      setRoute("Verification")
    }
    if(error) {
      if ("data" in error) {
          const errorData = error as any
          toast.error(errorData.data.message);
      }
  }
  }, [isSuccess, error])

  // Create and submit our form
  const formik = useFormik({
    initialValues: {
        name: '',
        email: '',
        password: ''
    },
    validationSchema: schema,
    onSubmit: async({name, email, password}) =>{
        const data = {
          name, email, password
        }
        setIsLoading(true)
        // Register user
        await register(data)
        setIsLoading(false)
    }
  })

  const { errors, touched, values, handleChange, handleSubmit } = formik

  return (
    <div className="w-full">
      <h1 className={`${styles.title}`}>
        Create your account
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
        {/* NAME FIELD */}
         <label className={`${styles.label}`}>
          Enter your Name
         </label>
         <input type="text" value={values.name} onChange={handleChange} id="name" name="name"
           placeholder="Your Name" className={`${errors.name && touched.name && "border-rose-500"}
           ${styles.input}`}/>
           {errors.name && touched.name && (
         <span className="text-rose-500 pt-2 block">{errors.name}</span>
          )}
        </div>
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
            <Button value="Sign Up" type="submit" className={`${styles.button}`} isLoading={isLoading}>
              Register
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
           Already have an account?{" "}
           <span className="text-[#BFA181] pl-1 cursor-pointer" onClick={() => setRoute("Login")}>
             Sign In
           </span>
         </h5>
      </form>
      <br />
    </div>
  )
}

export default SignUp
