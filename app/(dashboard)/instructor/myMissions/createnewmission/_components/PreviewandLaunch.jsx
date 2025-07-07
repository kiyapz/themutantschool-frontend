import Actionbtn from "./Actionbtn";
import Analitiesbtn from "./Analitiesbtn";
import { FiEdit, FiTrash2 } from 'react-icons/fi' 
import { FaPlay } from 'react-icons/fa'
import { MdOutlineQuiz } from 'react-icons/md' 
import { FaClipboardList } from 'react-icons/fa' 

export default function PreviewandLaunch() {
    return (
        <div className="flex flex-col gap-10 ">
            <div className="w-full h-fit grid xl:grid-cols-3 gap-10  ">
                 <div className="border  border-[#6D4879] w-full h-[30vh] sm:h-full rounded-[13px] ">1</div>
                 <div className="col-span-2 ">
                    <p className="font-[600] text-[25px] text-center sm:text-start sm:text-[33px] leading-[40px] ">Mobile App Design With Figma</p>
                     <div className="flex items-center gap-4 ">
                        <button className="bg-[#7343B3] text-black rounded-[4px] w-[86.67px] ">Published</button>
                        <p className="text-[#728C51] font-[600] text-[10px] leading-[40px] ">Created: Jan 11, 2025 / Last updated: 2 Days ago</p>

                     </div>

                     <p className="h-[150px] overflow-auto font-[300] text-[16px] leading-[30px] ">
                     In this course, you'll unlock the core powers of mobile UI/UX design using Figma. Learn to craft sleek, intuitive app interfaces, build scroll-stopping prototypes, and think like a true product mutant. Whether you're just starting out or leveling up, this is your crash course in creating mobile magic—no code, just design sorcery.
                     </p>


                 </div>

            </div>

            <div className="grid gap-5  xl:grid-cols-3  ">
                <Analitiesbtn text1={'Total Enrollment'} text2={'2'} text3={'+2 from last month'} />
                <Analitiesbtn  text1={'Completion Rate'} text2={'78%'} text3={'+2 from last month'} />
                <Analitiesbtn text1={'Mutant Rating'} text2={'4.8'} text3={'+2 from last month'} />

            </div>

            <div  style={{paddingBottom:'20px'}}  className="flex flex-col gap-5 rounded-[20px] border border-[#535353]  ">


                <div style={{padding:'30px'}} className="border-b border-[#535353]">
                    <ul className="flex items-center gap-3 ">
                        <li>Curriculum</li>
                        <li>Students</li>
                        <li>Resources</li>
                        <li>Interactions</li>
                        <li>Interactions</li>
                    </ul>
                </div>


                <div style={{padding:'30px'}} className="w-full flex items-center justify-between ">
                    <p>Course Curriculum</p>
                    <button style={{padding:'5px 10px'}} className="bg-[#5E36A5] rounded-[8px]  ">+    Add Chapter</button>
                </div>

                <div style={{margin:'0 30px '}} className="flex flex-col gap-5 rounded-[15px] border  border-[#535353] ">

                <div style={{padding:'10px'}} className="w-full border-b border-[#535353] xl:flex items-center justify-between">
                    <div style={{paddingLeft:'50px'}}>
                        <p className="text-[18px] font-[700] text-[16px] leading-[40px] ">Introduction to Mobile App Designs</p>
                        <p className="text-[#838383] text-[12px] font-[300]  ">3 Lessons / 30m</p>
                    </div>
                    <div className="flex items-center gap-5 ">
                        <Actionbtn  icon={<FiEdit />} style={'text-[#002BFF] border-[#002BFF] border border-[1px]' } text={'Edit'} />
                        <Actionbtn  icon={<FiTrash2 />} style={'text-[#FF0000] border-[#FF0000] border border-[1px]' } text={'Delete'} />
                        <Actionbtn style={'bg-[#5E36A5] border-[0px] ' } text={'Publish'} />
                    </div>

                </div>

                <div style={{padding:'25px'}} className="flex flex-col gap-5">
                    <div style={{paddingLeft:'15px'}} className="flex border-[0.5px] border-[#535353] bg-[#352e2b] rounded-[8px] items-center gap-3">
                        <div>
                            <FaClipboardList />
                        </div>
                       
                        <div>
                        <p className="text-[18px] font-[700] text-[16px] leading-[40px] ">A Summary of Design</p>
                        <p className="text-[#838383] text-[12px] font-[300]  ">Text  . 10 minutes</p>
                        </div>
                    </div>


                    <div style={{paddingLeft:'15px'}} className="flex border-[0.5px] rounded-[8px] border-[#535353] bg-[#352e2b] items-center gap-3">
                        <div>
                            <FaPlay />
                        </div>
                       
                        <div>
                        <p className="text-[18px] font-[700] text-[16px] leading-[40px] ">A Summary of Design</p>
                        <p className="text-[#838383] text-[12px] font-[300]  ">Text  . 10 minutes</p>
                        </div>
                    </div>


                    <div style={{paddingLeft:'15px'}} className="flex border-[0.5px] rounded-[8px] border-[#535353] bg-[#352e2b] items-center gap-3">
                        <div>
                            <MdOutlineQuiz />
                        </div>
                       
                        <div>
                        <p className="text-[18px] font-[700] text-[16px] leading-[40px] ">A Summary of Design</p>
                        <p className="text-[#838383] text-[12px] font-[300]  ">Text  . 10 minutes</p>
                        </div>
                    </div>



                    <button
                
                className="w-full h-[59.76px] rounded-[12px] border border-dashed border-[#696969] text-white py-[15px]"
              >
                + Add Lesson
              </button>
                </div>
                </div>




                <div style={{margin:'0 30px '}} className="flex flex-col gap-5 rounded-[15px] border  border-[#535353] ">

<div style={{padding:'10px'}} className="w-full border-b border-[#535353] xl:flex items-center justify-between">
    <div style={{paddingLeft:'50px'}}>
        <p className="text-[18px] font-[700] text-[16px] leading-[40px] ">Figma Basics</p>
        <p className="text-[#838383] text-[12px] font-[300]  ">3 Lessons / 25m</p>
    </div>
    <div className="flex items-center gap-5 ">
        <Actionbtn  icon={<FiEdit />} style={'text-[#002BFF] border-[#002BFF] border border-[1px]' } text={'Edit'} />
        <Actionbtn  icon={<FiTrash2 />} style={'text-[#FF0000] border-[#FF0000] border border-[1px]' } text={'Delete'} />
        <Actionbtn style={'bg-[#5E36A5] border-[0px] ' } text={'Publish'} />
    </div>

</div>

<div style={{padding:'25px'}} className="flex flex-col gap-5">
    <div style={{paddingLeft:'15px'}} className="flex border-[0.5px] border-[#535353] bg-[#5E31A1] rounded-[8px] items-center gap-3">
        <div>
            <FaPlay />
        </div>
       
        <div>
        <p className="text-[18px] font-[700] text-[16px] leading-[40px] ">Basic Tool in Figma</p>
        <p className="text-[#838383] text-[12px] font-[300]  ">Video  . 15 minutes</p>
        </div>
    </div>





    



    <button

className="w-full h-[59.76px] rounded-[12px] border border-dashed border-[#696969] text-white py-[15px]"
>
+ Add Lesson
</button>
</div>
</div>






            </div>




            <div className="grid xl:grid-cols-3 gap-5 w-full ">
<div style={{paddingLeft:'20px'}} className="bg-[#0F0F0F] h-[145.18px] rounded-[12px] flex items-center gap-3 ">
    <div className="h-[71.59px] w-[71.59px] rounded-[10px] bg-[#4B68414D] text-[#7BBD25] flexcenter ">!</div>
    <div>
        <p className="text-[22px] font-[700] leading-[40px]  ">Upload Content</p>
        <p className="text-[10px] font-[300] leading-[15px]  ">Add videos, documents and other course materials</p>
    </div>
</div>
<div style={{paddingLeft:'20px'}} className="bg-[#0F0F0F] h-[145.18px] rounded-[12px] flex items-center gap-3 ">
    <div className="h-[71.59px] w-[71.59px] rounded-[10px] bg-[#4953754D] text-[#5F7ADD] flexcenter ">!</div>
    <div>
        <p className="text-[22px] font-[700] leading-[40px]  ">Students Messages</p>
        <p className="text-[10px] font-[300] leading-[15px]  ">5 New messages awaiting response</p>
    </div>
</div>
<div style={{paddingLeft:'20px'}} className="bg-[#0F0F0F] h-[145.18px] rounded-[12px] flex items-center gap-3 ">
    <div className="h-[71.59px] w-[71.59px] rounded-[10px] bg-[#73643F4D] text-[#CC6525] flexcenter ">!</div>
    <div>
        <p className="text-[22px] font-[700] leading-[40px]  ">Analytics Report</p>
        <p className="text-[10px] font-[300] leading-[15px]  ">Generate detail course performance insight</p>
    </div>
</div>

</div>
        </div>
    )
}