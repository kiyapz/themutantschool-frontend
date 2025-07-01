export function EditprofileRadiobtn({ label, name = 'gender', value }) {
    const id = `${name}-${value}`;
    return (
      <label
      style={{padding:'10px'}}
        htmlFor={id}
        className="flex items-center gap-2 h-[47.16px] rounded-[6px] bg-[#1F1F1F] text-[#8C8C8C] font-[600]  w-full flex items-center justify-between text-[13px] sm:text-[15px] leading-[40px] cursor-pointer"
      >
        {label}
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          className="accent-[#8D5FCA] w-4 h-4"
        />
        
      </label>
    );
  }
  