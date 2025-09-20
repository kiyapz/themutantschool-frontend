import Link from "next/link";

export default function SidePanelLayout({
  text1,
  text2,
  text3,
  style,
  index,
  link,
}) {
  return (
    <>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2 xl:gap-6">
          <div className="  h-[20px] sm:h-[38.8px] w-[20px] text-white sm:w-[38.8px] flexcenter bg-[#28679B] rounded-full ">
            {index}
          </div>
          <div>
            <p className="text-[#B5B5B5] text-[15px] font-[700] xl:text-[22px]  ">
              {text1}
            </p>
            <p className="text-[#656565] text-[10px] xl:text-[19px] font-[300]  ">
              {text2}
            </p>
          </div>
        </div>
        {link ? (
          <Link href={link}>
            <div
              style={{ padding: "10px" }}
              className={`cursor-pointer hover:opacity-80 transition-opacity ${style}`}
            >
              {text3}
            </div>
          </Link>
        ) : (
          <div style={{ padding: "10px" }} className={`${style}`}>
            {text3}
          </div>
        )}
      </div>
    </>
  );
}
