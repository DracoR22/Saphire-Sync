'use client'

import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi"
import Image from "next/image"
import Loader from "./Loader"
import { useState } from "react"
import { useRouter } from "next/navigation"

const Hero = () => {

  // GET BANNER DATA QUERY
  const {data, isLoading} = useGetHeroDataQuery("Banner", {})

  const [search, setSearch] = useState("")
  const router = useRouter()

  const handleSearch = () => {
    if(search === "") {
      return
    } else {
      router.push(`/courses?title=${search}`)
    }
  }

  return (
    <>
    {isLoading ? (
      <Loader/>
    ) : (
      <div>
      <div className="h-screen text-black dark:text-white">
        <div className="flex justify-center flex-col pt-[50px] px-16">
            <div className="grid md:grid-cols-2 gap-6">
           <div className="pt-[50px]">
           <h1 className="text-3xl lg:text-4xl xl:text-5xl font-[700]">
              {data?.layout?.banner?.title}
            </h1>
             <h2 className="my-8 text-base xl:text-lg text-[#BFA181]">
             {data?.layout?.banner?.subTitle}
            </h2>
            <div className="flex justify-center mt-2">
               <button onClick={() => router.push('/courses')}
                className="bg-[#00df9a] hover:bg-[#3b9693] transition text-lg font-bold p-3 px-6 text-white rounded-full">
                 Explore Courses
               </button>
               {/* SEARCH BAR */}
               {/* <input type="search" placeholder="Search Courses..." value={search} onChange={(e) => setSearch(e.target.value)}
               className="bg-transparent border dark:border-none dark:bg-[#575757] dark:placeholder:text-[#ffffffdd] rounded-[5px] p-2 w-full h-full outline-none text-[#0000004e] dark:text-[#ffffffe6] text-[20px] font-[500] font-Josefin" />
                <div className="absolute flex items-center justify-center w-[50px] cursor-pointer h-[50px] right-0 top-0 bg-[#39c1f3] rounded-r-[5px]"
                 onClick={handleSearch}></div> */}
            </div>
           </div>
           <div className=" hidden md:flex items-center justify-center">
             <Image src={data?.layout?.banner?.image?.url} alt="Sapphire" width={450} height={450} className="pl-[24px] hero_animation rounded-full"/>
           </div>
            </div>
        </div>
      </div>
    </div>
    )}
    </>
  )
}

export default Hero
