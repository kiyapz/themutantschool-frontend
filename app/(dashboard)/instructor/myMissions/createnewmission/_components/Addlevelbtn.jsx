export default function Addlevelbtn({text,level}) {
    return (
        <div style={{paddingLeft:'15px'}} className="bg-[#1D1D1D] text-[var(--background)] text-[15px] sm:text-[21px] leading-[150%] flex items-center rounded-[12px] h-[73.64px] w-full ">
            <span className="text-[#7D7D7D] text-[12px] sm:text-[19px] leading-[150%] ">Capsule {level} :  </span > {text}
            
        </div>
    )
}