'use client'

import Link from "next/link";
import { InstructorContext } from "../../_components/context/InstructorContex";
import { useContext } from "react";


export default function profilesetting() {
    const {profiledisplay,setprofiledisplay} = useContext(InstructorContext)
    return (
        <div className="h-fit w-full max-w-[1200px] flex flex-col gap-[10px] ">
           <p className="hidden sm:block text-[var(--sidebar-hovercolor)] font-[600] text-[42px] leading-[40px] ">My Profile</p>
           <p className="hidden sm:block text-[var(--small-textcolor)] text-[13px] font-[600] leading-[40px] ">You can update your personal details here</p>

           <div  style={{   background: "linear-gradient(to right, #592BC3, #952CC5)",  }} className="h-[218.12px] w-full rounded-b-[40px]   sm:hidden"></div>
           <div style={{marginBottom:'15px',margin:'auto'}}   className="h-fit w-[95%]    relative z-20 top-[-80px] sm:top-[10px] ">
                <div className="grid w-full gap-3 xl:grid-cols-4">

                    {/* Side Bar */}
                    <div style={{paddingLeft:'35px',paddingTop:'40px',paddingBottom:'15px',paddingRight:'10px'}} className=" bg-[var(--black-background)] xl:flex flex-col gap-5 hidden ">
                        
                       
                       <div className="flexcenter w-full h-fit flex-col  gap-3 ">
                            <div className="h-[100px] w-[100px] relative left-[10px] sm:left-0  xl:h-[150px] xl:w-[150px] rounded-full border-[11px] bg-pink-200 ">
                                    
                            </div>

                            <div>
                                <p className=" font-[600] text-[26px] sm:text-[25px] leading-[150%] ">Etieno Ekanem</p>
                                <p className=" text-[17px] text-[var(--button-border-color)]  sm:text-[15px] leading-[150%]  ">Product Designer || Tutor</p>
                            </div>
                            </div>
                       

                         {/* divider  */}
                         <div className="bg-[#323232] w-full h-[1px] "></div>

{/* side bar */}
                         <div style={{paddingLeft:'35px',paddingTop:'40px',paddingRight:'10px'}} className=" bg-[var(--black-background)] flex flex-col space-y-[20px] hidden xl:block">
                        
                        <Link href='/instructor/profile'>
                        <div onClick={()=>setprofiledisplay('Personal Information')} className={`${profiledisplay === 'Personal Information' ? 'text-[#8D5FCA]' :'text-[var(--coco-color)]' }   hover:text-[#8D5FCA] cursor-pointer w-full flex items-center justify-between  text-[15px] leading-[150%] font-[600] `}>
                            Personal Information
                            <p>{` >`} </p>
                        </div>
                        </Link>
                        <Link href='/instructor/profile/notification'>
                        <div onClick={()=>setprofiledisplay('Notifications')} style={{marginTop:'20px',marginBottom:'20px'}} className={ `${profiledisplay === 'Notifications' ? 'text-[#8D5FCA]' :'text-[var(--coco-color)]' }     hover:text-[#8D5FCA] flex items-center justify-between  cursor-pointer  text-[15px] leading-[150%] font-[600] `}>
                            Notifications
                        <p>{` >`} </p>
                        </div>
                        </Link>
                        <Link href='/instructor/profile/profilesetting'>
                        <div onClick={()=>setprofiledisplay('Security Settings')} className={ `${profiledisplay === 'Security Settings' ? 'text-[#8D5FCA]' :'text-[var(--coco-color)]' }     hover:text-[#8D5FCA] flex items-center justify-between  cursor-pointer  text-[15px] leading-[150%] font-[600] `}>
                            Security Settings

                        <p>{` >`} </p>
                        </div>
                        </Link>
                    </div>


                    </div>



                      {/* Personal Profile */}
                    <div style={{padding:'15px'}}  className="flex bg-[var(--black-background)] flex-col gap-5 sm:col-span-3 h-fit w-full">
                        
                          <p className="font-[700] text-[17px] leading-[40px] ">Security Settings</p>
                          
                          <div style={{padding:'10px'}} className='border w-full flex items-center justify-between h-[121.39px] border-[#B2B2B221] '>
                            
                            <div>
                                <p className="font-[600] text-[19px] leading-[150%] ">Change Password</p>
                                <p className='text-[#4B4B4B] text-[16px] leading-[150%] ' >Set a unique password to protect your lab</p>
                            </div>
                            <div>
                            <button style={{padding:'10px'}} className="bg-[#604196] text-[11px]  rounded-[8px] ">
                            Change Password
                            </button>
                            </div>

                          </div>








                       

                    </div>

                </div>
           </div>
           
        </div>
    )
}