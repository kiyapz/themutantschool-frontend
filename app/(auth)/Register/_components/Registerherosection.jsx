export default function Registerherosection({heading,subheading,text,gap}) {
    return (
        <div className={`flex flex-col items-center  justify-center ${gap} `}>
  <div>
       <p className="text-[22px] leading-[27px]   sm:text-[27px] sm:leading-[31px]  Xirod text-center ">{heading}</p>
       <p className="text-[22px] leading-[27px]   sm:text-[27px] sm:leading-[31px]  Xirod text-center ">{subheading}</p>
  </div>
  
       <p className="text-[10px] leading-[27px]    text-[var(--info)]  sm:text-[15px] sm:leading-[27px] font-[500] text-center  ">{text}</p>
</div>
    )
}