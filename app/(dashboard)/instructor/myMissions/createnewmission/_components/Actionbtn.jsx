export default function Actionbtn({ style, icon, text }) {
  return (
    <div>
      <button
        style={{ padding: "0 30px" }}
        className={`${style} flex items-center gap-2 cursor-pointer  text-[12px] rounded-[4px] leading-[40px] `}
      >
        <span>{icon}</span>
        {text}
      </button>
    </div>
  );
}
