import Link from "next/link";

export default function SidePanelLayout({
  text1,
  text2,
  text3,
  style,
  index,
  link,
  completed = false,
}) {
  return (
    <>
      <div className="w-full flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 xl:gap-6 flex-1 min-w-0">
          <div
            className={`h-[24px] sm:h-[32px] md:h-[38.8px] w-[24px] sm:w-[32px] md:w-[38.8px] flex-shrink-0 text-white text-[12px] sm:text-[14px] flexcenter rounded-full transition-colors duration-300 ${
              completed ? "bg-[#25AF35]" : "bg-[#28679B]"
            }`}
          >
            {completed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5 text-white"
              >
                <path
                  fillRule="evenodd"
                  d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              index
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[#B5B5B5] text-[13px] sm:text-[15px] md:text-[18px] xl:text-[22px] font-[700] leading-tight truncate">
              {text1}
            </p>
            <p className="text-[#656565] text-[10px] sm:text-[11px] md:text-[14px] xl:text-[19px] font-[300] leading-tight mt-1">
              {text2}
            </p>
          </div>
        </div>
        {link ? (
          <Link href={link} className="flex-shrink-0">
            <div
              className={`cursor-pointer hover:opacity-80 transition-opacity px-3 py-2 sm:px-4 sm:py-2.5 rounded ${style}`}
            >
              {text3}
            </div>
          </Link>
        ) : (
          <div
            className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded flex-shrink-0 ${style}`}
          >
            {text3}
          </div>
        )}
      </div>
    </>
  );
}
