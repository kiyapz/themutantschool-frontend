export default function RegisterInput({placeholder,textCenter, value, onchange,type}) {
    return (
        <input placeholder={placeholder}  value={value} type={type} onChange={onchange} className={`w-full px outline-none ${textCenter} bg-[var(--accent)] text-[var(--button-color)] h-[70.31px] sm:h-[75.16px] rounded-[8px] sm:rounded-[10px] sm:font-[300] text-[17px] font-[600] sm:text-[18px] leading-[57px] `} />  
    )
}



