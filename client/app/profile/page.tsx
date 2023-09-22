'use client'

import { useSelector } from "react-redux"
import Header from "../components/Header"
import Protected from "../hooks/useProtected"
import Heading from "../utils/Heading"
import { useState } from "react"
import Profile from "../components/profile/Profile"

interface Props {
    
}

const page = (props: Props) => {

    const [open, setOpen] = useState(false)
    const [activeItem, setActiveItem] = useState(0)
    const [route, setRoute] = useState("Login")

    const { user } = useSelector((state: any) => state.auth)

    return (
        <div>
            <Protected>
            <Heading 
            title={`${user.name} - Sapphire`}
            description="Saphire Sync is a platform for students to learn and get help from teachers"
            keywords="Programming, Redux..."/>
           <Header open={open} setOpen={setOpen} activeItem={activeItem} setRoute={setRoute} route={route}/>
           <Profile user={user}/>
            </Protected>
        </div>
    )
}

export default page
