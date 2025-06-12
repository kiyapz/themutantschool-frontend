export default function RegisterInput({placeholder,textCenter, value, onchange,type}) {
    return (
        <input placeholder={placeholder}  value={value} type={type} onChange={onchange} className={`w-full px outline-none ${textCenter} bg-[var(--accent)] text-[var(--button-color)] h-[75.16px] rounded-[10px] font-[300] text-[18px] leading-[57px] `} />  
    )
}



