'use client';

import PasswordInput from "@/app/(auth)/-components/PasswordInput.jsx";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
    const date = new Date();
    return (
        <div className="flex py flex-col items-center  justify-between  h-[90vh]    sm:h-screen w-full">
            <div className="mt-mutantlogin grid  grid-cols-1 sm:grid-cols-2 sm:gap-4  w-full max-w-[350px] md:max-w-[900px]   px  xl:max-w-[1200px] h-fit">
                 <div style={{ backgroundImage: `url('/images/loginimg.png')` }} className="hidden sm:block bg-cover h-full   rounded-[30px] bg-center"> </div>

                 <div className=" w-full flex  justify-center h-fit">
                    <div className="  py mt-mutantlogin   flex flex-col gap-8 w-full h-full  ">
                          <h2 className="hidden sm:block  text-center Xirod text-[26px] leading-[41px] text-[var(--secondary)]  ">MUTANT</h2>

                          <div className="flex flex-col gap-7 h-full">

                            <div>
                                <h1 className="font-[400] text-[16px] leading-[57px]  text-center Xirod sm:text-[31px] sm:leading-[40px] text-[var(--background)]  ">ENTER THE LAB</h1>
                                <p className="hidden sm:block text-center text-[var(--info)] font-[700] text-[13px] leading-[27px]   ">Login to continue your mutation</p>
                            </div>
                            

                            <div className="flex w-full h-full  flex-col justify-around gap-4">
                                <div className="flex flex-col gap-4">
                                    <input type="email" placeholder="Email" className="h-[70.31px] font-[400] text-[17px] leading-[57px] rounded-[8px] w-full px p-2 sm:rounded-[10px] sm:h-[75.16px]  !bg-[var(--accent)] " />
                                    
                                    <PasswordInput placeholder='Password' />
                                    <div className="grid grid-cols-[1.5fr_1fr] xl:grid-cols-3 h-[75.16px] gap-3 xl:gap-4 w-full   ">
                                       <div className="h-[60.5px] w-full xl:col-span-2  flex items-center justify-between px    rounded-[8px] btn cursor-pointer ">
                                           <p className="font-[600] text-[15px] leading-[57px] text-[var(--background)] ">Enter the Lab</p>
                                           <Image src={'/images/Arrow.png'} alt="arrow" width={18} height={15} />
                                       </div>
                                       <div className="h-[60.5px] w-full   border-[1px] rounded-[8px] flex items-center justify-between px  border-[var(--primary)]  cursor-pointer" >
                                            <Image src={'/images/google.png'} alt="arrow" width={28.75} height={28.36} />
                                             <p className="font-[600] xl:text-[20px] text-[15px] leading-[57px] text-[var(--background)] ">Google</p>
                                       </div>
                                  </div>
                                 
                                 </div>

                                    <Link href='/ForgotPassword'><p className="text-center text-[var(--text-light)] text-[12px] font-[500] leading-[40px] ">Forgot Password?</p></Link>

                                 <div>
                                    
                                    <div className="h-[60.5px] w-full flexcenter font-[600] text-[12px] sm:text-[14px] leading-[40px] text-[var(--background)]  border-[1px] px rounded-[8px] border-[var(--primary)] sm:h-[75.16px] "> 
                                        <p>New here? <Link href='/Register'><span className="text-[var(--primary)] ">Begin Your Transformation</span></Link> </p>
                                    </div>
                                 </div>

                                    
                            </div>

                          </div>
                    </div>
                 </div>
            </div>

            <div>
               <p className="text-center text-[var(--text-light)] text-[14px] font-[500] leading-[40px] ">Copyright©Themutantschool2025</p>
            </div>
        </div>
    )
}