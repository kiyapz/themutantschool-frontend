import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import GuestAccountInfo from "@/components/mutantcart/GuestAccountInfo";

export default function HomeLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header>
        <div className="fixed top-0 left-0 w-full h-fit flexcenter bg-black flex-col  z-50">
          <div
            style={{ marginBottom: "15px" }}
            className="w-full h-[30px]  flexcenter  overflow-hidden bg-[var(--primary-light)] py-6"
          >
            <div className="whitespace-nowrap animate-marquee text-white  h-[20px] flexcenter text-2xl text-black font-semibold">
              <span className="inline-block font-[400] text-[20px] text-black  leading-[70px] sm:leading-[40px] px-4">
                50% OFF FOR THE FIRST 100 RECRUITS - BEGIN YOUR TRANSFORMATION
                NOW
              </span>
              <span className="inline-block font-[400] text-[20px] leading-[70px] text-black sm:leading-[40px] px-4">
                50% OFF FOR THE FIRST 100 RECRUITS - BEGIN YOUR TRANSFORMATION
                NOW
              </span>
            </div>
          </div>

          {/* Nav Bar */}
          <div className="max-w-[1440px] px w-full h-full bg-black   ">
            <Navbar />
          </div>
        </div>
      </header>
      <main className="flex-grow">{children}</main>
      <Footer />
      <GuestAccountInfo />
    </div>
  );
}
