'use client'
import { useState } from "react"
import Addlevelbtn from "./Addlevelbtn"

export default function AddLevels() {
    const [Level,setLevel] = useState('AddLevel')
    return (
        <>

        {Level === 'AddLevel' && 
        
        <div onClick={()=>setLevel('SetAddLevel')} style={{paddingBottom:'30px'}} className="w-full h-[404.49px] flex items-end justify-center  shadow-[#696969] bg-[#0F0F0F] ">

            <div className="w-[90%] h-[247.06px]   flexcenter flex-col border border-dashed border-[#696969] gap-5 rounded-[22px] bg-[#131313] ">
              <p style={{padding:'10px'}} className="font-[600] text-[21px] leading-[20%] bg-[#2E2E2E] h-[30px] w-[30px] flexcenter rounded-full ">+</p>
              <p className="font-[600] text-[12px] sm:text-[21px] leading-[20%] ">Add New Level</p>
            </div>

            </div>
        
        }




        {Level === 'SetAddLevel' && 
        
        <div className="flex flex-col gap-10 ">
        <div style={{padding:'30px'}} className="w-full h-fit flex flex-col gap-3  shadow-[#696969] bg-[#0F0F0F] ">
          <>
          <p className="text-[#6F6F6F] font-[600] text-[15px] sm:text-[25px] leading-[150%] ">Level 1:   <span className="text-[15px]  sm:text-[25px] text-[var(--background)] ">HTML Genesis</span></p>
          <p className="text-[#ACACAC] font-[500] text-[12px] sm:text-[24px] ">Basic concept and overview</p>
          </>
           <div className="flex flex-col gap-5">
            <Addlevelbtn level='1' text='HTML Genesis' />
            <Addlevelbtn level='2' text='Alternatives to HTML' />
            <Addlevelbtn level='3' text='Alternatives to HTML' />
           </div>

           <div>
            <button style={{padding:'15px'}} className="w-full border-[1px] h-[59.76px] rounded-[12px] border-dashed border-[#696969] ">+ Add Power Capsule</button>
           </div>

        </div>



        <div style={{padding:'30px'}} className="w-full h-fit flex flex-col gap-3  shadow-[#696969] bg-[#0F0F0F] ">
          <>
          <p className="text-[#6F6F6F] font-[600] text-[15px] sm:text-[25px] leading-[150%] ">Level 2:   <span className="text-[15px]  sm:text-[25px] text-[var(--background)] ">HTML Genesis</span></p>
          <p className="text-[#ACACAC] font-[500] text-[12px] sm:text-[24px] ">Basic concept and overview</p>
          </>
           
           <div>
            <button style={{padding:'15px'}} className="w-full border-[1px] h-[59.76px] rounded-[12px] border-dashed border-[#696969] ">+ Add Power Capsule</button>
           </div>

        </div>





        </div>
        
        }

            

        </>
       
    )
}