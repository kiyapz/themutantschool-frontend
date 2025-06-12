import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div>
      <div className="fixed top-0 left-0 w-full h-fit flexcenter flex-col hap-3 z-50">
           <div className="w-full   h-[70px] bg-[var(--primary-light)]">
       
            </div>

               {/* Nav Bar */}
           <div className="max-w-[1440px] px w-full h-full   ">
             <Navbar />
           </div>
      </div>
      

        {/* Herosection */}
      <div style={{backgroundImage: "url('/images/0_Tunnel_Neon_1920x1080 3.png')"}} className="h-screen flexcenter flex-col w-full bg-cover bg-center">
         <div className="max-w-[336.97px] herosection-mb flexcenter flex-col gap-5  sm:max-w-[500px] w-full  px-4">

            <div>
               <h2 className="Xirod text-[40px] sm:text-[60px] leading-[37px] sm:leading-[62px] text-center  ">YOU AIN’T </h2>
               <h2 className="bg-gradient-to-r from-[#7CD668] via-[#BDE75D] to-[#F5FFDF] bg-clip-text text-transparent Xirod text-[40px] leading-[40px] sm:text-[60px] sm:leading-[62px] text-center ">LIKE THE OTHERS</h2>
           </div> 

               <p className="Xirod text-[14px] sm:text-[18px] leading-[14px] sm:leading-[70px] text-[var(--info)] text-center ">MUTANT GENE DETECTED</p>
           <div className="flexcenter h-[70px] w-fit evolution-button">
           <div className="evolution-button-inner flexcenter h-full w-full">
               <p className="font-[700] text-[17px] leading-[70px] ">START YOUR EVOLUTION</p>
            </div>
           
          </div>
         </div>

      

      </div>
    </div>
  );
}
