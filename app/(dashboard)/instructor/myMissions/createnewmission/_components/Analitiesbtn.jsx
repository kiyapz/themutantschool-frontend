export default function Analitiesbtn({ text1, text2, text3,text4 }) {
  return (
    <div
      style={{ padding: "20px" }}
      className="w-full bg-[#090909] sm:bg-[#0F0F0F] h-fit sm:border sm:border-[#373737] rounded-[20px] flex justify-center items-center flex-col gap-1 sm:gap-2  "
    >
      <p className="hidden sm:block text-[#B5B5B5] font-[400] text-[20px] leading-[40px] ">
        {text1}
      </p>
      <p className=" font-[700] text-[#7343B3] sm:text-white text-[21px] sm:text-[54px] leading-[40px] ">
        {text2}
      </p>
      <p className="text-[#208045]  sm:text-[#94FF98] font-[500] text-[14px] leading-[40px] hidden sm:block">
        {text3}
      </p>
      <p className="text-[#505050] font-[500] text-[9px] leading-[24px] sm:hidden">
        {text4}
      </p>
    </div>
  );
}
