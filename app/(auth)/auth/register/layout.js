"use client";
import "../../../globals.css";
import Authnav from "./_components/Authnav";
// import { GloblaxcontexProvider } from "@/context/Globlaxcontex";
import AuthNavBar from "../../-components/AuthNavBar";
import Navbar from "@/components/Navbar";
import { GloblaxcontexProvider } from "@/context/Globlaxcontex";





export default function RootLayout({ children }) {
  return (
   
                // <div>
                // <body>
        <GloblaxcontexProvider>
        <div className="" >
          <div  className="block h-[10vh]  top-0 left-0 flex items-center justify-center w-full  sm:hidden">
            {/* <AuthNavBar /> */}
            <Navbar />
          </div>
          
          <div className="hidden sm:block  top-0 left-0 w-full h-[10vh] z-50">
          <div className="hidden sm:block  h-[10vh] flexcenter ">
            <Authnav />
          </div>
          </div>
         
           {children}
        </div>
        </GloblaxcontexProvider>
    
    // </body>
  );
}
