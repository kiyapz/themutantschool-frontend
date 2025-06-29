import Image from "next/image";

export default function Sidebarbtn({ image, text, hoverImage }) {
  return (
    <button className="flex text-[var(--sidebar-linkcolor)] hover:text-[var(--sidebar-hovercolor)] transition duration-200 items-center gap-5 cursor-pointer group">
      {image && (
        <span className="transition duration-200 relative w-[8.9px] h-[8.9px]">
          {/* Default image */}
          <Image 
            src={image} 
            alt="icon" 
            width={8.9} 
            height={8.9} 
            className="group-hover:opacity-0 transition duration-200 absolute"
          />
          {/* Hover image (if provided) */}
          {hoverImage && (
            <Image 
              src={hoverImage} 
              alt="icon" 
              width={8.9} 
              height={8.9} 
              className="opacity-0 group-hover:opacity-100 transition duration-200 absolute"
            />
          )}
          {/* Fallback: Color filter if no hover image provided */}
          {!hoverImage && (
            <Image 
              src={image} 
              alt="icon" 
              width={8.9} 
              height={8.9} 
              className="opacity-0 group-hover:opacity-100 brightness-75 sepia saturate-200 hue-rotate-180 transition duration-200 absolute"
            />
          )}
        </span>
      )}
      <span className="text-[18px]  leading-[40px]">
        {text}
      </span>
    </button>
  );
}