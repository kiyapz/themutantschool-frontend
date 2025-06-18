import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div>
      <div className="fixed top-0 left-0 w-full h-fit flexcenter flex-col hap-3 z-50">
           <div className="w-full   h-[70px] bg-[var(--primary-light)]">
       
            </div>

               {/* Nav Bar */}
           <div className="max-w-[1440px] px w-full h-full bg-black   ">
             <Navbar />
           </div>
      </div>
      

        {/* Herosection */}
      <div style={{backgroundImage: "url('/images/0_Tunnel_Neon_1920x1080 3.png')"}} className="h-screen flex items-center justify-center flex-col w-full bg-cover bg-center">
      <div className="w-screen h-screen absolute top-0 z-40 left-0 bg-[rgba(0,0,0,0.7)] "></div>
         
         <div  style={{paddingTop:'10%'}} className="max-w-[336.97px]  relative herosection-mb flexcenter flex-col gap-5  sm:max-w-[500px] w-full  px-4">
            
             <div className="absolute shadow-[-4px_4px_10px_rgba(255,192,203,0.5)] top-[38.5px] bottom-10 sm:bottom-0  h-[180px]  w-[80px] sm:h-[200px] z-10 h-[80px]  w-[80px] sm:w-[100px]"> </div> 
             <div className="absolute border-pink-100 border rotate-4 shadow-[-4px_-4px_10px_rgba(255,192,203,0.5)] top-[38.5px] sm:top-[42.1%]  h-[80px]  w-[80px] sm:h-[100px] z-20 h-[80px]  w-[80px] sm:w-[100px]"></div>
             <div className="absolute border-pink-100 border rotate-7 shadow-[-4px_-4px_10px_rgba(255,192,203,0.5)] top-[38.3px] sm:top-[42%]  h-[80px]  w-[80px] sm:h-[100px] z-20 h-[80px]  w-[80px] sm:w-[100px]"></div>
             <div className="absolute border-pink-100 border rotate-5  shadow-[-4px_-4px_10px_rgba(255,192,203,0.5)] top-[38.5px] sm:top-[42.5%]  h-[80px]  w-[80px] sm:h-[100px] z-20 h-[80px]  w-[80px] sm:w-[100px]"></div>


            

            <div className="relative z-40">
               <h2 className="Xirod text-[40px] sm:text-[60px] leading-[37px] sm:leading-[62px] text-center  ">YOU AIN’T </h2>
               <h2 className="bg-gradient-to-r from-[#7CD668] via-[#BDE75D] to-[#F5FFDF] bg-clip-text text-transparent Xirod text-[40px] leading-[40px] sm:text-[60px] sm:leading-[62px] text-center ">LIKE THE OTHERS</h2>
           </div> 

               <p className="Xirod text-[14px] relative z-40 sm:text-[18px] leading-[14px] sm:leading-[70px] text-[var(--info)] text-center ">MUTANT GENE DETECTED</p>
           <div className="flexcenter relative z-40 h-[70px] w-fit evolution-button">
           <div className="evolution-button-inner flexcenter h-full w-full">
               <p className="font-[700] text-[17px] leading-[70px] ">START YOUR EVOLUTION</p>
            </div>
           
          </div>
         </div>

      

      </div>


      {/* main section */}
      <div className="h-[50vh] w-full bg-pink-300 ">

      </div>
    </div>
  );
}
