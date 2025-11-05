export default function Changebtn({ text, onclick, sm = "sm:text-[19px]", className = "" }) {
  return (
    <button
      onClick={onclick}
      className={`${sm} h-[50px] sm:h-[60px] md:h-[67.11px] px-6 sm:px-8 md:px-10 Xirod font-[400] text-[12px] leading-[40px] bg-[#874982] rounded-[10px] cursor-pointer transition-all hover:opacity-90 ${className}`}
    >
      {text}
    </button>
  );
}
