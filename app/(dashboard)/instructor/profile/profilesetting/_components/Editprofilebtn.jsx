export function Editprofilebtn({
    placeholder,
    label,
    height = 'h-[47.16px]',
    type = 'text',
  }) {
    const id = label.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-3">
        <label
          htmlFor={id}
          className="text-[#8C8C8C] font-[600] text-[13px] sm:text-[15px] leading-[40px]"
        >
          {label}
        </label>
        <input
        style={{paddingLeft:'10px'}}
          type={type}
          id={id}
          name={id}
          placeholder={placeholder}
          className={`${height} w-full rounded-[6px] bg-[#1F1F1F] outline-none px-4 text-white`}
        />
      </div>
    );
  }
  
