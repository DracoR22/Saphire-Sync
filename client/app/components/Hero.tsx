'use client'

import Image from "next/image"

const Hero = () => {
  return (
    <div>
      <div className=" text-black dark:text-white">
        <div className="flex justify-center flex-col pt-[50px] px-16">
            <div className="grid md:grid-cols-2 gap-6">
           <div className="pt-[50px]">
           <h1 className="text-3xl lg:text-4xl xl:text-5xl font-Poppins font-bold ">
              Unlock Your Potential with Sapphire Sync: Learn, Grow, Succeed!
            </h1>
             <h2 className="my-6 text-sm xl:text-base text-[#BFA181]">
              Our mission is to make learning accessible, engaging, and tailored to your unique journey.
            </h2>
            <div className="flex justify-center">
               <button className="bg-[#00df9a] hover:bg-[#3b9693] transition font-bold p-2.5 px-6 text-white rounded-full">
                 Explore Courses
               </button>
            </div>
           </div>
           <div className=" hidden md:flex items-center justify-center">
             <Image src='/owlbg.png' alt="Sapphire" width={450} height={450} className="pl-[24px] hero_animation rounded-full"/>
           </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
