import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Mutant School | Home Page",
  description:
    "Welcome to the Mutant School portal. Explore courses, connect with instructors, and stay updated.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <div className="fixed top-0 left-0 w-full h-fit flexcenter bg-black flex-col  z-50">
            {/* <div className="w-full h-[70px] bg-[var(--primary-light)]"> */}
            <div style={{marginBottom:'30px'}} className="w-full  overflow-hidden bg-[var(--primary-light)] py-6">
              <div className="whitespace-nowrap animate-marquee text-white text-2xl text-black font-semibold">
                <span className="inline-block font-[400] text-[10px] text-black  leading-[30px] sm:leading-[40px] px-4">
                  50% OFF FOR THE FIRST 100 RECRUITS - BEGIN YOUR TRANSFORMATION
                  NOW
                </span>
                <span className="inline-block font-[400] text-[10px] leading-[30px] text-black sm:leading-[40px] px-4">
                  50% OFF FOR THE FIRST 100 RECRUITS - BEGIN YOUR TRANSFORMATION
                  NOW
                </span>
              </div>
              {/* </div> */}
            </div>

            {/* Nav Bar */}
            <div  className="max-w-[1440px] px w-full h-full bg-black   ">
              <Navbar />
            </div>
          </div>
        </header>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
