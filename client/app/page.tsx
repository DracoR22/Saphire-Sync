'use client'

import { useState } from "react"
import Header from "./components/Header"
import Heading from "./utils/Heading"
import Hero from "./components/Hero"

interface Props {
  
}

const Home = () => {

 const [open, setOpen] = useState(false)
 const [activeItem, setActiveItem] = useState(0)
 const [route, setRoute] = useState("Login")

  return (
    <div>
      <Heading 
      title="Sapphire" 
      description="Saphire Sync is a platform for students to learn and get help from teachers"
      keywords="Programming, Redux..."/>
      <Header open={open} setOpen={setOpen} activeItem={activeItem} setRoute={setRoute} route={route}/>
      <Hero/>
    </div>
  )
}

export default Home
