export default function Sidebtn({text}) {
    return (
      <div className="flex items-center cursor-pointer gap-3">
        <div className="h-[22.25px] w-[22.25px] bg-[#D9D9D9] "></div>
        <p className="text-[#9B9B9B] font-[500] text-[21px] leading-[40px] ">
          {text}
        </p>
      </div>
    );
}