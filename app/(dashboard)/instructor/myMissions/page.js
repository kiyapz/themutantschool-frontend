'use client'
import Image from "next/image";
import { FiClock } from "react-icons/fi";
import Sidebuttons from "./_components/Sidebuttons";
import { MdMenuBook } from "react-icons/md";
import { FaTag } from "react-icons/fa";
import { FaMoneyBillWave } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
import { FaStar } from 'react-icons/fa';

export default function page() {


    const studetcourse =[
        {
        id:1,
        purpose:'Design Principles: Beginners',
        type:'course',
        recruits:500,
        revenue:'$2500',
        rating:4.5,
        progress:50,
        image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcST1X_KXRZTcaSF3D_INaAnaZY0OyJ70jbYyw&s'
      },{
        id:2,
        purpose:'Design Principles: Beginners',
        type:'',
        recruits:500,
        revenue:'$2500',
        rating:5,
        progress:100,
        image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQy26vJHT36wsJbtLIYECQYK3ypBjoguRpMQA&s'
      },{
        id:3,
        purpose:'Design Principles: Beginners',
        type:'course',
        recruits:500,
        revenue:'$2500',
        rating:3.5,
        progress:80,
        image:'https://theadminbar.com/wp-content/uploads/2025/04/What-you-need-to-know-about-Figma.webp'
      },{
        id:4,
        purpose:'Design Principles: Beginners',
        type:'',
        recruits:500,
        revenue:'$2500',
        rating:1.5,
        progress:20,
        image:'https://www.psdly.to/wp-content/uploads/2025/04/Udemy-Figma-Crash-Course-Learn-UI-Design-Step-by-Step.jpg'
      },
      {
        id:5,
        purpose:'Design Principles: Beginners',
        type:'course',
        recruits:500,
        revenue:'$2500',
        rating:4.5,
        progress:50,
        image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcST1X_KXRZTcaSF3D_INaAnaZY0OyJ70jbYyw&s'
      },{
        id:6,
        purpose:'Design Principles: Beginners',
        type:'',
        recruits:500,
        revenue:'$2500',
        rating:5,
        progress:100,
        image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQy26vJHT36wsJbtLIYECQYK3ypBjoguRpMQA&s'
      },{
        id:7,
        purpose:'Design Principles: Beginners',
        type:'course',
        recruits:500,
        revenue:'$2500',
        rating:3.5,
        progress:80,
        image:'https://theadminbar.com/wp-content/uploads/2025/04/What-you-need-to-know-about-Figma.webp'
      },{
        id:8,
        purpose:'Design Principles: Beginners',
        type:'',
        recruits:500,
        revenue:'$2500',
        rating:1.5,
        progress:20,
        image:'https://www.psdly.to/wp-content/uploads/2025/04/Udemy-Figma-Crash-Course-Learn-UI-Design-Step-by-Step.jpg'
      }
    ]

    return (
        <div className="flex flex-col h-full gap-10 w-full">

               <div className="  h-fit w-full flex flex-col gap-10    ">
                        <div className="hidden sm:flex h-fit justify-between  w-full">
                        <div>
                          <p className="text-[var(--sidebar-hovercolor)] font-[600] leading-[40px] text-[42px] ">My Missions</p>
                          <p className="text-[var(--text)] text-[13px] xl:text-[15px] leading-[40px] ">Here you see all your uploaded courses</p>
                        </div>
                        <div >
                          <button className="bg-[#604196] flex items-center justify-center gap-1 font-[700] text-[15px] leading-[30px] h-[57.02px] rounded-[10px]  w-[216.75px] ">
                         
                          Launch New Mission
                          </button>
              
                        </div>
              
                        </div>
                         

                        <div className="hidden sm:flex flex-col gap-5 xl:gap-0  xl:flex-row h-fit justify-between  w-full">
                        <div className="grid grid-cols-4 xl:flex items-center gap-3 ">
                            
                            <Sidebuttons items={[
                                    { label: "View", onClick: () => console.log("View clicked") },
                                    { label: "Edit", onClick: () => console.log("Edit clicked") },
                                    { label: "Delete", onClick: () => console.log("Delete clicked") },
                                  ]} width={'sm:w-full xl:w-fit'} icons={<FiClock />} text='Duration' />
                            <Sidebuttons items={[
                                    { label: "View", onClick: () => console.log("View clicked") },
                                    { label: "Edit", onClick: () => console.log("Edit clicked") },
                                    { label: "Delete", onClick: () => console.log("Delete clicked") },
                                  ]} width={'sm:w-full xl:w-fit'} icons={<MdMenuBook />} text='Category' />
                            <Sidebuttons items={[
                                    { label: "View", onClick: () => console.log("View clicked") },
                                    { label: "Edit", onClick: () => console.log("Edit clicked") },
                                    { label: "Delete", onClick: () => console.log("Delete clicked") },
                                  ]} width={'sm:w-full xl:w-fit'} icons={<FaTag />} text='Price' />
                            <Sidebuttons items={[
                                    { label: "View", onClick: () => console.log("View clicked") },
                                    { label: "Edit", onClick: () => console.log("Edit clicked") },
                                    { label: "Delete", onClick: () => console.log("Delete clicked") },
                                  ]} width={'sm:w-full xl:w-fit'} icons={<FaMoneyBillWave />} text='Level' />
                          
                        </div>
                        <div className=" sm:grid sm:w-full xl:block xl:w-fit" >
                          
                            <Sidebuttons items={[
                                    { label: "View", onClick: () => console.log("View clicked") },
                                    { label: "Edit", onClick: () => console.log("Edit clicked") },
                                    { label: "Delete", onClick: () => console.log("Delete clicked") },
                                  ]} width={'sm:w-full xl:w-fit'} icons={<FiClock />} text='Sort By: Popularity' />
              
                        </div>
              
                        </div>

                        {/* small phone */}

                        <div className="  flex items-center gap-3 sm:hidden ">
                            
                            <Sidebuttons icons={<FiClock />} text='Filter' />
                            <Sidebuttons icons={<MdMenuBook />} text='Sort By' />
                            
                          
                        </div>

                        {/* small phone */}


                         <div className="sm:hidden ">
                        <div style={{padding:'10px'}} className="sm:hidden bg-[#0F0F0F] rounded-[10px]  flex items-center justify-between w-full gap-3 sm:hidden ">
                            
                           <div className="flexcenter w-full h-full flex-col gap-2 text-[#7343B3] font-[600] text-[31px] leading-[11px] ">
                            1
                            <p className="text-[var(--background)] text-[8px] leading-[11px] ">Total Missions</p>
                            </div>
                             <span  className="h-[53px] w-[1px] bg-[#212121] "></span>
                           <div className="flexcenter w-full h-full flex-col gap-2 text-[#00895E] font-[600] text-[31px] leading-[11px] ">
                            2
                            <p className="text-[var(--background)] text-[8px] leading-[11px] ">Published</p>
                           </div>
                             <span  className="h-[53px] w-[1px] bg-[#212121] "></span>
                           <div className="flexcenter w-full h-full flex-col gap-2 text-[#FF8C00] font-[600] text-[31px] leading-[11px] ">
                            3
                            <p className="text-[var(--background)] text-[8px] leading-[11px] ">Draft</p>
                           </div>
                          
                        </div>
                        </div>
                        
              
               </div>


          <div  style={{padding:'15px'}}  className="w-full h-fit  flex justify-center">


               <div className="grid gap-5 sm:grid-cols-2  w-full xl:grid-cols-3">

               

               {studetcourse.slice(0,8).map((el) => (
                     <div
                       key={el.id}
                      
                       className="  w-full flex flex-col xl:max-w-[410.14px] h-[447.91px] bg-[#0F0F0F] rounded-[20px] p-4 shrink-0"
                     >
                       <div style={{backgroundImage:`url(${el.image})`}} className="h-[173.34px]  bg-cover bg-center rounded-t-[20px] w-full "></div>
                       <div className="px w-full flex-1 flex flex-col justify-between  py">
                         <div className="flex flex-col gap-3">
                         <div className="w-full flex items-center justify-between">
                           <button className="bg-[#393D4E] rounded-[5px] px  text-[#ABABAB] font-[500] text-[13px] leading-[25px] " >Design</button>
                           
                           <div className="flex space-x-1">
                                       {[1, 2, 3, 4, 5].map((star) => (
                                              <FaStar
                                                key={star}
                                                size={10}
                                                color={star <= el.rating ? '#EFDB3F' : '#E5E7EB'} 
                                              />
                                            ))}
                                </div>
                         </div>
                         <div>
                         <p className="text-[#E8EDF6] font-[600] text-[15px] sm:text-[27px] leading-[35px] ">{el.purpose}:</p>
                         <p className="text-[#E8EDF6] font-[600] text-[27px] leading-[35px] ">{el.type}</p>
                         </div>
                         </div>
               
                         <div className="w-full self-end ">
                        <div className="w-full flex items-center justify-between">
                        <p className="text-[#767E8F] font-[400] text-[10px] leading-[20px] ">Recruit Progress</p>
                        <p className="text-sm text-right mt-1 text-gray-800">{el.progress}%</p>
                         </div>
               
                         <div>
                              
                         <div className="w-full max-w-md">
                     <div className="w-full bg-[#000000] rounded-full h-[8px] overflow-hidden">
                       <div
                         className="h-full bg-[#4F3457] transition-all duration-200"
                         style={{ width: `${el.progress}%` }}
                       />
                     </div>
                     
                   </div>
               
                         </div>
               
                         <div className="flex items-center w-full justify-between">
                           <div>
                             
                             
                             <p><span>24 </span>Recruits</p>
                           </div>
               
                           <p>{`>`}</p>
                         </div>
                         </div>
                       </div>
                     </div>
                   ))}




               </div>
             </div>
               </div>  
        // </div>
    )
}