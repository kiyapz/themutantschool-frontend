export default function SidePanelLayout({text1,text2,text3,style}) {
  return (
    <>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2 xl:gap-6">
          <div className="  h-[20px] sm:h-[38.8px] w-[20px] sm:w-[38.8px] flexcenter bg-[#28679B] rounded-full ">
            i
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
        <div className={    `${style}`}>{text3}</div>
      </div>
    </>
  );
}
