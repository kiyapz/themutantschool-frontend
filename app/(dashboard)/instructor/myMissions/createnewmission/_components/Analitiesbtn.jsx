export default function Analitiesbtn({text1,text2,text3}) {
    return (
        <div style={{padding:'20px'}} className="w-full bg-[#0F0F0F] h-fit border border-[#373737] rounded-[20px] flex justify-center items-center flex-col gap-2  ">
           <p className="text-[#B5B5B5] font-[400] text-[20px] leading-[40px] ">{text1}</p>
           <p className=" font-[700] text-[54px] leading-[40px] ">{text2}</p>
           <p className="text-[#94FF98] font-[500] text-[14px] leading-[40px] ">{text3}</p>
        </div>
    )
}