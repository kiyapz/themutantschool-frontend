import { useContext } from "react";
import { AcademyGloblaxcontex } from "./academycontext/AcademyContext";

export default function RegisterInput({
  placeholder,
  textCenter,
  value,
  onchange,
  type,
  handledelete,
  hidden
}) {
  const { successValue } = useContext(AcademyGloblaxcontex);

  return (
    <div
      className={`relative w-full px outline-none ${textCenter} bg-[var(--accent)] text-[var(--background)] placeholder-[var(--button-color)] h-[70.31px] sm:h-[75.16px] rounded-[8px] sm:rounded-[10px] sm:font-[300] text-[17px] font-[600] sm:text-[18px] leading-[57px]`}
    >
      <input
        placeholder={placeholder}
        value={value}
        type={type}
        onChange={onchange}
        className="w-full h-full outline-none bg-transparent pr-10" // add padding-right so text doesn't go under the icon
      />

      <span
        className={`
          ${successValue ? "text-green-500 border-green-500" : "text-red-500 border-red-500"}
          absolute right-3 top-1/2 transform -translate-y-1/2
          w-[22px] h-[22px] text-[10px] rounded-full flex items-center justify-center border-[1px] cursor-pointer
          ${hidden}
        `}
      >
        {successValue ? "✓" : <span onClick={handledelete}>✕</span>}
      </span>
    </div>
  );
}
