import Image from "next/image";

export default function Sidebarbtn({
  image,
  text,
  hoverImage,
  active = false,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 cursor-pointer group transition duration-200 py-1 ${
        active
          ? "text-[var(--sidebar-hovercolor)]"
          : "text-[var(--sidebar-linkcolor)] hover:text-[var(--sidebar-hovercolor)]"
      }`}
    >
      {image && (
        <span className="relative w-[8.9px] h-[8.9px]">
          {/* Default image */}
          <Image
            src={image}
            alt="icon"
            width={8.9}
            height={8.9}
            className={`absolute transition duration-200 ${
              hoverImage ? "group-hover:opacity-0" : ""
            } ${active ? "opacity-0" : "opacity-100"}`}
          />

          {/* Hover image (if provided) */}
          {hoverImage && (
            <Image
              src={hoverImage}
              alt="icon"
              width={8.9}
              height={8.9}
              className={`absolute transition duration-200 ${
                active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
            />
          )}

          {/* Fallback color filter */}
          {!hoverImage && (
            <Image
              src={image}
              alt="icon"
              width={8.9}
              height={8.9}
              className={`absolute transition duration-200 ${
                active
                  ? "opacity-100 brightness-150 sepia saturate-200 hue-rotate-10"
                  : "opacity-0 group-hover:opacity-100"
              }`}
            />
          )}
        </span>
      )}

      <span className="text-[15px] leading-[24px]">{text}</span>
    </button>
  );
}
