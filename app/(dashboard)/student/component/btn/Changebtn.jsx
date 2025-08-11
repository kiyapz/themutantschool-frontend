export default function Changebtn({text,onclick,sm = 'sm:text-[19px]'}) {
    return (
      <button
        onClick={onclick}
        style={{ padding: "0 40px" }}
        className={`${sm} h-[67.11px] Xirod font-[400] text-[10px]  leading-[40px] bg-[#874982] rounded-[10px] cursor-pointer `}
      >
        {text}
      </button>
    );
}

