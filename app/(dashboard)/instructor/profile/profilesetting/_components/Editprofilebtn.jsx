export function Editprofilebtn({
  placeholder,
  label,
  height = "h-[47.16px]",
  type = "text",
  value,
  onChange,
  readOnly = false,
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-3">
      <label
        htmlFor={id}
        className="text-[#8C8C8C] font-[600] text-[13px] sm:text-[15px] leading-[40px]"
      >
        {label}
      </label>
      <input
        style={{ paddingLeft: "10px", paddingRight: "10px" }}
        value={value ?? ""}
        onChange={onChange}
        type={type}
        readOnly={readOnly}
        id={id}
        name={id}
        placeholder={placeholder}
        className={`${height} w-full rounded-[6px] bg-[#1F1F1F] outline-none px-4 text-white ${
          readOnly ? "opacity-60 cursor-not-allowed" : ""
        }`}
      />
    </div>
  );
}
