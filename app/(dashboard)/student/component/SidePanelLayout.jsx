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
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2 xl:gap-6">
          <div
            className={`h-[20px] sm:h-[38.8px] w-[20px] text-white sm:w-[38.8px] flexcenter rounded-full transition-colors duration-300 ${
              completed ? "bg-[#25AF35]" : "bg-[#28679B]"
            }`}
          >
            {completed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-3 sm:w-5 h-3 sm:h-5 text-white"
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
