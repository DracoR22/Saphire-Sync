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
import { useEffect } from 'react'

// Socket IO
import socketIO from "socket.io-client";
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });


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
      <body className={`${poppins.variable} ${josefin.variable} bg-white bg-no-repeat dark:bg-gradient-to-b dark:from-[#0A1828] dark:to-black duration-300`}>
        <Providers>
          <SessionProvider>
         <ToastContainer theme="dark" autoClose={3000}/>
          <ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
             <Custom>
             {children}
             </Custom>
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

  useEffect(() => {
    socketId.on("connection", () => {})
  }, [])

  return (
    <>
    {isLoading ? <Loader/> : <>{children}</>}
    </>
  )
}
