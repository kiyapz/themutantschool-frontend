import { Editprofilebtn } from "../../../profile/profilesetting/_components/Editprofilebtn";
import { FaVideo, FaCamera, FaImage } from 'react-icons/fa';

export default function MissionDetails() {
    return (
        <div style={{padding:'30px'}} className="w-full bg-[#0F0F0F] h-fit  ">
            <p style={{marginBottom:'30px'}} className="font-[600] text-[28px] leading-[150%] ">Launch New Mission</p>
            {/* /divider/ */}
            <hr className="h-[1px] w-full border-[1px] border-[#4D4D4D] " />

            <div>
                 <Editprofilebtn label="Mission Title" />
                 <Editprofilebtn label="Short Description" />
            </div>


            <div>
            <div className="flex flex-col gap-3">
  <label
    htmlFor='bio'
    className="text-[#8C8C8C] font-[600] text-[13px] sm:text-[15px] leading-[40px]"
  >
    Short Bio (About Me)
  </label>
  <textarea
    style={{padding:'10px'}}
    name='bio'
    placeholder='bio'
    rows={5} // You can adjust the number of rows
    className="w-full rounded-[6px] bg-[#1F1F1F] outline-none px-4 py-3 text-white resize-none"
  ></textarea>
</div>
            </div>



<div className="w-full grid xl:grid-cols-3 sm:gap-5 ">

<Editprofilebtn label="Mission Title" />
<Editprofilebtn label="Short Description" />
<Editprofilebtn label="Short Description" />
</div>



<div className="w-full grid gap-5 xl:grid-cols-2 ">

<div className="flex flex-col gap-3">
  <label
    htmlFor='bio'
    className="text-[#8C8C8C] font-[600] text-[13px] sm:text-[15px] leading-[40px]"
  >
   Detailed Description
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


<div className="flex flex-col gap-3">
  <label
    htmlFor='bio'
    className="text-[#8C8C8C] font-[600] text-[13px] sm:text-[15px] leading-[40px]"
  >
    Mission Promo Video (optional)
  </label>
  {/* <div style={{paddingBottom:'30px'}} className="w-full h-[404.49px] flex items-end justify-center  shadow-[#696969] bg-[#0F0F0F] "> */}

<div className="w-full h-[301.65px]   flexcenter flex-col   rounded-[22px] bg-[#131313] ">
    <p className="text-center ">  <FaVideo size={90} title="Video Icon" /></p>
<p className="font-[400] text-[17px] leading-[40px] ">Drag and drop a video, or <span className="text-[#19569C] "> Browse</span></p>
<p className="text-[#787878] text-[13px]  ">MP4 (4:3, 60 seconds)</p>
</div>

{/* </div> */}
</div>

</div>






        </div>
    )
}