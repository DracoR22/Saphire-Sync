'use client'

import AdminProtected from "@/app/hooks/adminProtected"
import Heading from "@/app/utils/Heading"
import AdminSidebar from "@/app/components/admin/sidebar/AdminSidebar"
import DashboardHero from "@/app/components/admin/DashboardHero"
import AllCourses from "@/app/components/admin/course/AllCourses"
import AllUsers from "@/app/components/admin/users/AllUsers"

interface Props {
    
}

const Page = (props: Props) => {
    return (
        <div>
          <AdminProtected>
            <Heading 
            title={`Admin - Users - Sapphire`}
            description="Saphire Sync is a platform for students to learn and get help from teachers"
            keywords="Programming, Redux..."/>
             <div className="flex h-screen">
               <div className="1500px:w-[16%] w-1/5">
                 <AdminSidebar/>
               </div>
               <div className="w-[85%]">
                 <DashboardHero/>
                 <AllUsers/>
               </div>
             </div>
         </AdminProtected>
        </div>
    )
}

export default Page
