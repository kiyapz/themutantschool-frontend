'use client'

import Link from "next/link";
import { FiEdit } from "react-icons/fi";
import ToggleButton from "./_components/ToggleButton";
import { useContext } from "react";
import { InstructorContext } from "../../_components/context/InstructorContex";

export default function Notification() {
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
                        
                            {/* notificatiol */}
                                <div>
                                    <p className="font-[700] text-[17px] leading-[40px] ">Notifications Settings</p>
                                    {/* divider  */}
                         <div style={{margin:'5px 0'}} className="bg-[#323232] sm:hidden w-full h-[1px] "></div>


                         <div>

                         <div>
                                    <div className="w-full h-[100px] flex flex-col justify-center  ">
                            
                                    <p className="font-[600] text-[20px] leading-[150%] ">Security Alerts</p>
                                    <p className="font-[500] text-[var(--text)] text-[14px] leading-[150%] ">Set up the security alerts you want to receive</p>
                                    </div>
                                </div>

                                <div>
                                <div className="flex flex-col gap-10">
      <ToggleButton
        label="Notify me of a new device login"
        initialState={true}
        onToggle={(state) => console.log("Toggle state:", state)}
      />

      <ToggleButton
        label="Email me when unusual activities are encountered"
        initialState={false}
      />
    </div>
                                </div>

                                </div>


                                <div>

<div>
           <div className="w-full h-[100px] flex flex-col justify-center  ">
   
           <p className="font-[600] text-[20px] leading-[150%] ">News and Updates</p>
           <p className="font-[500] text-[var(--text)] text-[14px] leading-[150%] ">Set up newsletter alerts you want to receive</p>
           </div>
       </div>

       <div>
       <div className="flex flex-col gap-10">
<ToggleButton
label="Send me notifications of new features and updates through email"
initialState={true}
onToggle={(state) => console.log("Toggle state:", state)}
/>

<ToggleButton
label="Send me tips and latest news"
initialState={false}
/>
</div>
       </div>

       </div>



                                </div>








                       

                    </div>

                </div>
           </div>
           
        </div>
    )
}