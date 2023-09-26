'use client'

import Loader from "@/app/components/Loader"
import CourseContent from "@/app/components/course/CourseContent"
import { useLoadUserQuery } from "@/redux/features/api/apiSlice"
import { redirect } from "next/navigation"
import { useEffect } from "react"

const Page = ({params}: {params: { id: string }}) => {

  // Get Course Id From Params
  const id = params.id

  // Get Load User Query
  const {isLoading, error, data} = useLoadUserQuery(undefined, {})

  // Check If The User Purchased The Course
  useEffect(() => {
    if(data) {
    const isPurchased = data.user.courses.find((item: any) => item._id === id)
    if(!isPurchased) {
        redirect("/")
    }
    }

    if(error) {
        redirect("/")
    }
  }, [data, error])

  return (
    <>
      {isLoading ? (
        <Loader/>
      ) : (
        <div>
          <CourseContent id={id} user={data.user}/>
        </div>
      )}
    </>
  )
}

export default Page
