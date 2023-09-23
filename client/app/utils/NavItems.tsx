import Link from "next/link"

export const navItemsData = [
    {
        name: "Home",
        url: "/"
    },
    {
        name: "Courses",
        url: "/courses"
    },
    {
        name: "About",
        url: "/about"
    },
    {
        name: "FAQ",
        url: "/faq"
    },
]

type Props = {
    activeItem: number
    isMobile: boolean
}

const NavItems = ({activeItem, isMobile}: Props) => {
  return (
    <>
    <div className="hidden 800px:flex">
      {navItemsData && navItemsData.map((item, i) => (
        <Link href={`${item.url}`} key={i} passHref>
          <span className={`${activeItem === i 
        ? "text-[#00df9a]"
        : "dark:text-white hover:text-[#00df9a] dark:hover:text-[#00df9a] transition text-black"} text-[15px] px-6 font-Poppins font-[400]`}>
            {item.name}
          </span>
        </Link>
      ))}
    </div>
    {isMobile && (
        <div className="800px:hidden mt-5">
          <div className="w-full text-center py-6">
            <Link href='/' passHref>
              <span className="text-[25px] font-Poppins font-[500] text-black dark:text-white">
                Sapphire
              </span>
            </Link>
          </div>
            {navItemsData && navItemsData.map((item, i) => (
                 <Link href='/' key={i} passHref>
                 <span className={`${activeItem === i 
                ? "text-[#00df9a]"
                : "dark:text-white text-black"} block py-5 text-[15px] px-6 font-Poppins font-[400]`}>
                    {item.name}
                 </span>
               </Link>
            ))}
        </div>
    )}
    </>
  )
}

export default NavItems
