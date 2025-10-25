import Image from "next/image";

export default function LoadingBar({ completed, total, isQuizPassed }) {
  const progressPercentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div
      style={{ marginBottom: "10px" }}
      className="flex justify-between items-center w-full h-full px-4 gap-4 sm:gap-0"
    >
      <span className="text-[12px] font-[700] xl:text-[28px] leading-[100%]">
        {completed}/{total}
      </span>
      <div className="w-[70%] sm:w-[80%] h-[20px] xl:h-[34px] relative border-[4px] border-[#840B94] rounded-[50px] bg-black">
        <div
          className="h-full bg-[#D550E6] rounded-[50px] transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        ></div>
        <div className="absolute top-[-3px] right-[-1px]">
          <Image
            width={10.16}
            height={13.93}
            alt="power"
            src={`/images/students-images/Group 956 (1).png`}
          />
        </div>
      </div>
      <span className="text-[#037B9D] leading-[100%] text-[12px] font-[700] xl:text-[28px]">
        5 XP
      </span>
    </div>
  );
}
