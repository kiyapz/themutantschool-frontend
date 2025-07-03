export default function Addlevelbtn({ text, level }) {
    return (
      <div
        style={{ paddingLeft: '15px' }}
        className="bg-[#1D1D1D] text-[var(--background)] text-[15px] sm:text-[21px] leading-[150%] flex items-center gap-2 rounded-[12px] h-[73.64px] w-full"
      >
        <div className="flex-shrink-0 w-fit">
          <span className="text-[#7D7D7D] text-[12px] sm:text-[19px]">Capsule {level}:</span>
        </div>
  
        <input
          type="text"
          defaultValue={text}
          className="bg-transparent outline-none text-white w-full placeholder:text-gray-500"
        />
      </div>
    )
  }
  