'use client'

import Heading from "@/app/utils/Heading"
import AdminSidebar from "@/app/components/admin/sidebar/AdminSidebar"
import DashboardHeader from "@/app/components/admin/DashboardHeader"
import CreateCourse from "@/app/components/admin/course/CreateCourse"

interface Props {
    
}

const Page = (props: Props) => {
    return (
        <div>
          <Heading 
            title={`Create Course - Admin - Sapphire`}
            description="Saphire Sync is a platform for students to learn and get help from teachers"
            keywords="Programming, Redux..."/>
            <div className="flex">
              <div className="1500px:w-[16%] w-1/5">
                 <AdminSidebar/>
              </div>
              <div className="w-[85%]">
                <DashboardHeader/>
                <CreateCourse/>
              </div>
            </div>
        </div>
    )
}

export default Page
