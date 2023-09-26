'use client'

import CourseDetailsPage from "@/app/components/course/CourseDetailsPage"

const Page = ({params}: {params: {id: string}}) => {
  return (
    <div>
      <CourseDetailsPage id={params.id}/>
    </div>
  )
}

export default Page
