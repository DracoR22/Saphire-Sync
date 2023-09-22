'use client'

import './globals.css'
import { Poppins } from 'next/font/google'
import { Josefin_Sans } from 'next/font/google'
import { ThemeProvider } from './utils/ThemeProvider'
import { ToastContainer } from 'react-toastify'
import { Providers } from './Provider'
import { SessionProvider } from 'next-auth/react'

import 'react-toastify/dist/ReactToastify.css'
import { useLoadUserQuery } from '@/redux/features/api/apiSlice'
import Loader from './components/Loader'

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins"
})

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Josefin"
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${josefin.variable} bg-white bg-no-repeat dark:bg-gradient-to-b dark:from-[#0A1828] dark:to-black duration-300 overflow-hidden`}>
        <Providers>
          <SessionProvider>
         <ToastContainer theme="colored"/>
          <ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
             {children}
          </ThemeProvider>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  )
}

// Loading State
const Custom: React.FC<{children: React.ReactNode}> = ({children}) => {
  const {isLoading} = useLoadUserQuery({})
  return (
    <>
    {isLoading ? <Loader/> : <>{children}</>}
    </>
  )
}
