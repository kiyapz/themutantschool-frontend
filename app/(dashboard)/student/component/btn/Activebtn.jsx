export default function Activebtn({
  text,
  onClick,
  isActive = false,
  className = "",
}) {
  return (
    <button
      onClick={onClick}
      className={`bg-[#111111] border border-[#1f1f1f] transition-all duration-200 cursor-pointer sm:leading-[40px] sm:text-[27px] font-[400] h-[70px] sm:h-[100px] w-full ${
        isActive ? "bg-[#874982] border-[#874982] text-white" : "hover:bg-[#1a1a1a]"
      } ${className}`}
      type="button"
      aria-pressed={isActive}
    >
      {text}
    </button>
  );
}
