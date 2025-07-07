'use client'

import { useState } from "react"
import Addlevelbtn from "./Addlevelbtn"
import { Editprofilebtn } from "../../../profile/profilesetting/_components/Editprofilebtn"
import { FaVideo, FaCamera, FaImage } from 'react-icons/fa';
import ToggleButton from "../../../profile/notification/_components/ToggleButton";

export default function AddLevels() {
  const [Level, setLevel] = useState('AddLevel')
  const [openAddModel,setOpenAddModel] = useState(false)

  const [levels, setLevels] = useState([
    {
      id: 1,
      title: 'HTML Genesis',
      description: 'Basic concept and overview',
      purpose: 'Alternatives to HTML'
    }
  ])

  const handleAddLevel = () => {
    const newId = levels.length + 1
    setLevels([
      ...levels,
      {
        id: newId,
        title: `Level ${newId} Title`,
        description: 'Basic concept and overview',
        purpose: `Purpose of Level ${newId}`
      }
    ])
  }

  return (
    <>
      {Level === 'AddLevel' && (
        
          <div onClick={()=>setLevel('SetAddLevel')} style={{marginTop:'40px'}} className="w-[90%] h-[247.06px] flexcenter flex-col border border-dashed border-[#703D71] gap-5 rounded-[22px] bg-[#131313]">
            <p className="font-[600] text-[21px] sm:text-[40px] text-[#703D71] bg-[#221326] h-[30px] w-[30px] sm:h-[60px]  sm:w-[60px] flexcenter rounded-full">+</p>
            <p className="font-[600] text-[12px] sm:text-[21px]">Add New Level</p>
            <p className="font-[200] text-[12px] leading-[20%] text-[#9C9C9C] sm:text-[19px]">Create another learning module (5/5 remaining)</p>
          </div>
        
      )}

      {Level === 'SetAddLevel' && (
        <div style={{padding:'10px'}} className="flex flex-col gap-10">
          {levels.map((level) => (
            <div
             style={{padding:'30px'}}
              key={level.id}
              className="w-full h-fit flex flex-col gap-3 bg-[#0F0F0F] shadow-[#696969] px-[30px] py-[20px]"
            >
              <p className="text-[#BDE75D] font-[600] flex items-center gap-2 text-[15px] sm:text-[25px]">
                 <span className="w-[50px] flexcenter text-[25px] h-[50px] rounded-full bg-[#BDE75D] text-black ">
                {level.id}
                </span>
                <p> Level {level.id}</p>
               
               
              </p>
           

              <div className="grid grid-cols-2 gap-5">
                <Addlevelbtn placeholder='Level Title'  />
                <Addlevelbtn placeholder='Estimated Time' type="number" style="block"  />
                
              </div>

              <Addlevelbtn placeholder='Summary' />

              <button
                onClick={handleAddLevel}
                className="w-full h-[59.76px] rounded-[12px] border border-dashed border-[#696969] text-white py-[15px]"
              >
                + Add Power Capsule
              </button>
            </div>
          ))}

        

           <div onClick={()=>setOpenAddModel(true)} style={{marginTop:'40px'}} className="w-[100%] h-[247.06px] flexcenter flex-col border border-dashed border-[#703D71] gap-5 rounded-[22px] bg-[#131313]">
            <p className="font-[600] text-[21px] sm:text-[40px] text-[#703D71] bg-[#221326] h-[30px] w-[30px] sm:h-[60px]  sm:w-[60px] flexcenter rounded-full">+</p>
            <p className="font-[600] text-[12px] sm:text-[21px]">Add New Level</p>
            <p className="font-[200] text-[12px] leading-[20%] text-[#9C9C9C] sm:text-[19px]">Create another learning module (5/5 remaining)</p>
          </div>
        </div>
      )}

      {openAddModel &&
       <div className="fixed top-0 left-0 w-screen h-screen overflow-auto flex justify-center z-50 bg-[rgba(0,0,0,0.9)] ">


        <div style={{padding:'30px'}} className="max-w-[800px] flex flex-col gap-5 w-full h-fit bg-[#101010] ">
               <p className="text-[25px] leading-[40px] font-[700]  ">Add Power Capsule</p>

               <div className="flex flex-col gap-5">
               <Addlevelbtn placeholder='Mission Title' />
               <Addlevelbtn placeholder='Short Description' />
                               
               </div>

               <div className="w-full grid gap-5 xl:grid-cols-2 ">
               
               
               <div className="flex flex-col gap-3">
                 <label
                   htmlFor='bio'
                   className="text-[#8C8C8C] font-[600] text-[13px] sm:text-[15px] leading-[40px]"
                 >
                   Video Upload
                 </label>
                 {/* <div style={{paddingBottom:'30px'}} className="w-full h-[404.49px] flex items-end justify-center  shadow-[#696969] bg-[#0F0F0F] "> */}
               
               <div className="w-full h-[301.65px]   flexcenter flex-col   rounded-[22px] bg-[#131313] ">
                   <p className="text-center ">  <FaVideo size={90} title="Video Icon" /></p>
               <p className="font-[400] text-[17px] leading-[40px] ">Drag and drop a video, or <span className="text-[#19569C] "> Browse</span></p>
               <p className="text-[#787878] text-[13px]  ">MP4 (4:3, 60 seconds)</p>
               </div>
               
               {/* </div> */}
               </div>



               <div className="flex flex-col gap-3">
                 <label
                   htmlFor='bio'
                   className="text-[#8C8C8C] font-[600] text-[13px] sm:text-[15px] leading-[40px]"
                 >
                 Attachments
                 </label>
                 {/* <div style={{paddingBottom:'30px'}} className="w-full h-[404.49px] flex items-end justify-center  shadow-[#696969] bg-[#0F0F0F] "> */}
               
                           <div className="w-full h-[301.65px]  flexcenter flex-col   rounded-[22px] bg-[#131313] ">
                                <p className="text-center  ">      <FaImage size={90} title="Photo/Image Icon" />
                                </p>
                                <p className="font-[400] text-[17px] leading-[40px] ">Drag and drop Images, or <span className="text-[#19569C] "> Browse</span></p>
                                <p className="text-[#787878] text-[13px]  ">JPEG, PNG (Maximum 1400px * 1600px)</p>
                           </div>
                           
                       {/* </div> */}
               </div>
               
               
               
               </div>

               <div 
              //  style={{margin:'20px 0'}}
               >
                <ToggleButton label="Enable PublicPreview" />
               </div>

               <div className="flex itmes-center gap-2">
                <button onClick={()=>setOpenAddModel(false)} className="text-[16px] leading-[40px] font-[300] cursor-pointer rounded-[10px] bg-[#604196] w-[169.37px] ">Save</button>

                <button onClick={()=>setOpenAddModel(false)} className="text-[16px] leading-[40px] font-[300] cursor-pointer ">Save as Draft</button>

               </div>
        </div>

        </div>}
    </>
  )
}
