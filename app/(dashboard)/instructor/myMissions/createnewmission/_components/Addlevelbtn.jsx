export default function Addlevelbtn({ type='text', style ='hidden',placeholder}) {
    return (
      <div
        style={{ paddingLeft: '15px' }}
        className="bg-[#1D1D1D] text-[var(--background)] text-[15px] sm:text-[21px] leading-[150%] flex items-center gap-2 rounded-[12px] h-[73.64px] w-full"
      >
        
  
        <input
          type={type}
          // defaultValue={text}
          placeholder={placeholder}
          className="bg-transparent outline-none text-white w-full placeholder:text-[#444444] "
        />

        <div style={{padding:'10px'}} className={`${style}  flex-shrink-0 w-fit border-[#444444] border-l ` }>
          <span className="text-[#B4B4B4] text-[12px] sm:text-[19px]">hour</span>
        </div>
      </div>
    )
  }
  