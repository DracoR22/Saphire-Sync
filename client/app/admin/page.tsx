'use client'

import DashboardHero from "../components/admin/DashboardHero"
import AdminSidebar from "../components/admin/sidebar/AdminSidebar"
import AdminProtected from "../hooks/adminProtected"
import Heading from "../utils/Heading"

const Page = () => {
  return (
    <div>
      <AdminProtected>
      <Heading 
            title={`Admin - Sapphire`}
            description="Saphire Sync is a platform for students to learn and get help from teachers"
            keywords="Programming, Redux..."/>
        <div className="flex h-[200vh]">
          <div className="1500px:w-[16%] w-1/5">
             <AdminSidebar/>
          </div>
          <div className="w-[85%]">
             <DashboardHero/>
          </div>
        </div>
      </AdminProtected>
    </div>
  )
}

export default Page
