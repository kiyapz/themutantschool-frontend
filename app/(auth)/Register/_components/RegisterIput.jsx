export default function RegisterInput({
  placeholder,
  textCenter,
  value,
  onchange,
  type,
  handledelete,
  hidden,
  successValue,
}) {
  return (
    <div
      className={`w-full px outline-none ${textCenter} bg-[var(--accent)] flex items-center justify-between text-[var(--button-color)] h-[70.31px] sm:h-[75.16px] rounded-[8px] sm:rounded-[10px] sm:font-[300] text-[17px] font-[600] sm:text-[18px] leading-[57px] `}
    >
      <input
        placeholder={placeholder}
        value={value}
        type={type}
        onChange={onchange}
        className="w-full outline-none"
      />
      <span
        className={`${
          successValue
            ? "text-green-500 border-green-500"
            : "text-red-500 border-red-500"
        } w-[22px] cursor-pointer h-[22px] text-[10px] rounded-full flexcenter border-[1px] ${hidden}`}
      >
        {successValue ? "✓" : <span onClick={handledelete}>✕</span>}
      </span>
    </div>
  );
}
