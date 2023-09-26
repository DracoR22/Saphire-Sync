'use client'

import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi"
import Image from "next/image"
import Loader from "./Loader"

const Hero = () => {

  // GET BANNER DATA QUERY
  const {data, isLoading} = useGetHeroDataQuery("Banner", {})

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
             <h2 className="my-6 text-base xl:text-lg text-[#BFA181]">
             {data?.layout?.banner?.subTitle}
            </h2>
            <div className="flex justify-center">
               <button className="bg-[#00df9a] hover:bg-[#3b9693] transition font-bold p-2.5 px-6 text-white rounded-full">
                 Explore Courses
               </button>
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
