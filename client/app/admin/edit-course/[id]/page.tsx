'use client'

import DashboardHeader from "@/app/components/admin/DashboardHeader";
import Heading from "@/app/utils/Heading";
import AdminSidebar from "@/app/components/admin/sidebar/AdminSidebar"
import EditCourse from "@/app/components/admin/course/EditCourse";

type Props = {}

const Page = ({params}:any) => {

    const id = params?.id;

  return (
    <div>
        <Heading
          title={`Admin - Edit Course - Sapphire`}
          description="Saphire Sync is a platform for students to learn and get help from teachers"
          keywords="Programming, Redux..."
        />
        <div className="flex">
            <div className="1500px:w-[16%] w-1/5">
                <AdminSidebar />
            </div>
            <div className="w-[85%]">
               <DashboardHeader />
               <EditCourse id={id} />
            </div>
        </div>
    </div>
  )
}

export default Page