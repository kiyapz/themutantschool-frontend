'use client'
import Link from "next/link";
import { useContext } from "react";
import { FiEdit } from "react-icons/fi";
import { InstructorContext } from "../_components/context/InstructorContex";

export default function Profile() {
    
    const {profiledisplay,setprofiledisplay} = useContext(InstructorContext)

    return (
        <div className="h-fit w-full max-w-[1200px] flex flex-col gap-[10px] ">
           <p className="hidden sm:block text-[var(--sidebar-hovercolor)] font-[600] text-[42px] leading-[40px] ">My Profile</p>
           <p className="hidden sm:block text-[var(--small-textcolor)] text-[13px] font-[600] leading-[40px] ">You can update your personal details here</p>

           <div  style={{   background: "linear-gradient(to right, #592BC3, #952CC5)",  }} className="h-[218.12px] w-full rounded-b-[40px]   sm:hidden"></div>
           <div style={{marginBottom:'5px',margin:'auto'}}   className="h-fit w-[95%]    relative z-10 top-[-80px] sm:top-[10px] ">
                <div className="grid w-full gap-3 xl:grid-cols-4">

                    {/* Side Bar */}
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



                      {/* Personal Profile */}
                    <div style={{padding:'15px'}}  className="flex bg-[var(--black-background)] flex-col gap-5 sm:col-span-3 h-fit w-full">
                         
                         <div className="w-full flex items-end   xl:items-center justify-between ">
                            <div className="flex flex-col xl:flex-row xl:items-center gap-3 ">
                            <div className="h-[100px] w-[100px] relative left-[10px] sm:left-0  xl:h-[190px] xl:w-[190px] rounded-full border-[11px] bg-pink-200 ">
                                    
                            </div>

                            <div>
                                <p className=" font-[600] text-[26px] sm:text-[35px] leading-[150%] ">Etieno Ekanem</p>
                                <p className=" text-[17px] text-[var(--button-border-color)]  sm:text-[24px] leading-[150%] sm:text-[var(--greencolor)] ">Product Designer || Tutor</p>
                            </div>
                            </div>


                            <button style={{paddingLeft:'8px',paddingRight:'8px'}}  className="bg-[var(--purpel-btncolor)] w-fit    flexcenter gap-1 rounded-[10px] text-[8px] sm:text-[14px] leading-[40px] font-[700]  "><span><FiEdit size={8} /></span> Edit Profile</button>
                         </div>



                         {/* divider  */}
           <div className="bg-[#323232] w-full h-[1px] "></div>

{/* bio */}
<div>
 <p className="font-[700] text-[17px] leading-[40px] ">Bio</p>
 <div className="w-full h-[100px] overflow-auto scrollbar-hide  ">
     <p className=" text-[11px] xl:text-[16px] leading-[20px] ">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

 </div>
</div>

{/* divider  */}
<div className="bg-[#323232] w-full h-[1px] "></div>

{/* Profile */}

<div className="w-full">
 <p className="font-[700] text-[17px] leading-[40px] ">Personal Information</p>
 <div className="grid grid-cols-2 w-full items-center ">
  <div className="text-[#ADA5A5] font-[700] text-[13px] xl:text-[19px] leading-[40px] ">Email Address</div>
  <div className="text-[#818181] xl:text-[18px] leading-[20px] text-[8px] ">etienodouglas@gmail.com</div>
  <div className="text-[#ADA5A5] font-[700] text-[13px] xl:text-[19px] leading-[40px] ">Phone Number</div>
  <div className="text-[#818181] xl:text-[18px] leading-[20px] text-[8px] ">+234 (0) 9129495797</div>
  <div className="text-[#ADA5A5] font-[700] text-[13px] xl:text-[19px] leading-[40px] ">Gender</div>
  <div className="text-[#818181] xl:text-[18px] leading-[20px] text-[8px] ">Male</div>
  <div className="text-[#ADA5A5] font-[700] text-[13px] xl:text-[19px] leading-[40px] ">Nationality</div>
  <div className="text-[#818181] xl:text-[18px] leading-[20px] text-[8px] ">Nigerian</div>
  <div className="text-[#ADA5A5] font-[700] text-[13px] xl:text-[19px] leading-[40px] ">Date Of Birth</div>
  <div className="text-[#818181] xl:text-[18px] leading-[20px] text-[8px] ">12 - FEB - 2000</div>
  <div className="text-[#ADA5A5] font-[700] text-[13px] xl:text-[19px] leading-[40px] ">Preferred Language</div>
  <div className="text-[#818181] xl:text-[18px] leading-[20px] text-[8px] ">English (UK)</div>
 </div>
</div>


{/* Social Links */}

<div className="w-full">
 <p className="font-[700] text-[17px] leading-[40px] ">Social Links</p>
 <div className="grid grid-cols-2 w-full ">
  <div className="text-[#ADA5A5] font-[700] text-[13px] xl:text-[19px] leading-[40px] ">Personal Website</div>
  <div className="text-[#818181] xl:text-[18px] leading-[20px] text-[12px] ">https://eteklabs.framer.website</div>
  <div className="text-[#ADA5A5] font-[700] text-[13px] xl:text-[19px] leading-[40px] ">LinkedIn</div>
  <div className="text-[#818181] xl:text-[18px] leading-[20px] text-[12px] ">https://linkedin.com/in/etieno...</div>
  <div className="text-[#ADA5A5] font-[700] text-[13px] xl:text-[19px] leading-[40px] ">Instagram</div>
  <div className="text-[#818181] xl:text-[18px] leading-[20px] text-[12px] ">https://instagram.com/etieno...</div>
  <div className="text-[#ADA5A5] font-[700] text-[13px] xl:text-[19px] leading-[40px] ">X</div>
  <div className="text-[#818181] xl:text-[18px] leading-[20px] text-[12px] ">https://x.com/thedesigner_cg</div>
  <div className="text-[#ADA5A5] font-[700] text-[13px] xl:text-[19px] leading-[40px] ">Facebook</div>
  <div className="text-[#818181] xl:text-[18px] leading-[20px] text-[12px] ">Not Available</div>
  
 </div>
</div>




                       

                    </div>

                </div>
           </div>
           
        </div>
    )
}