'use client'

import AdminProtected from "@/app/hooks/adminProtected"
import AdminSidebar from "../../components/admin/sidebar/AdminSidebar"
import Heading from "@/app/utils/Heading"
import DashboardHero from "@/app/components/admin/DashboardHero"
import EditFaq from "@/app/components/admin/customization/EditFaq"

const Page = () => {
  return (
    <div>
      <AdminProtected>
      <Heading 
            title={`Admin - FAQ - Sapphire`}
            description="Saphire Sync is a platform for students to learn and get help from teachers"
            keywords="Programming, Redux..."/>
        <div className="flex h-[200vh]">
          <div className="1500px:w-[16%] w-1/5">
             <AdminSidebar/>
          </div>
          <div className="w-[85%]">
             <DashboardHero/>
             <EditFaq/>
          </div>
        </div>
      </AdminProtected>
    </div>
  )
}

export default Page
