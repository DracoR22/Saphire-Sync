import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi"
import { useEffect, useState } from "react"
import CourseCard from "./course/CourseCard"

const Courses = () => {

 // GET ALL COURSES QUERY
 const {data, isLoading} = useGetUsersAllCoursesQuery({})

 // STATES
 const [courses, setCourses] = useState<any>([])

 useEffect(() => {
  setCourses(data?.courses)
 }, [data])

  return (
    <div>
      <div className="w-[90%] 800px:w-[80%] m-auto">
      <h1 className="text-center text-[25px] sm:text-3xl lg:text-4xl dark:text-white text-[#000] font-[700] tracking-tight">
      Elevate Your Learning<span className="text-gradient pl-2">Experience</span>{" "}
          <br />
           With Our Courses
        </h1>
        <br />
        <br />
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12 border-0">
          {courses &&
            courses.map((item: any, index: number) => (
              <CourseCard item={item} key={index} />
            ))}
        </div>
      </div>
    </div>
  )
}

export default Courses
