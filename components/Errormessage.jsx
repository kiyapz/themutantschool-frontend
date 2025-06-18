export default function Errormessage({ message }) {
  return (
    <div className="text-red-500 absolute bottom-5 left-[20%] sm:left-[45%] text-[10px] sm:text-[15px] mt-1">
      {message}
    </div>
  );
}