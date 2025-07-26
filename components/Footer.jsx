import Image from "next/image";

export default function Footer(params) {
  return (
    <div className="h-[60vh] bg-black flexcenter flex-col gap-5 ">
      <p className="font-[400] text-center sm:leading-[117%] sm:text-[55px] ">
        MUTANT
      </p>
      <p className="text-center max-w-[284.03px] sm:max-w-[484.03px] w-full font-[600] sm:text-[30px] sm:leading-[36px] ">
        The Mutant School is for the ones who never fit the mold. And never
        planned to.
      </p>
      <div>
        <ul className="text-[#EB8AF2] text-[17px] leading-[36px] flex items-center gap-5 cursor-pointer font-[300] ">
          <li>Missions </li>
          <li>Tribe</li>
          <li> Contact HQ</li>
          <li>FAQ</li>
        </ul>
      </div>

      <div className=" flex items-center gap-5">
        <div className="h-[47.99px] flexcenter w-[54.47px] border border-[#B287FF] rounded-[10px] ">
          <Image
            src={"/images/Vector (14).png"}
            width={33.39}
            height={23.48}
            alt="social-icon"
          />
        </div>
        <div className="h-[47.99px] flexcenter w-[54.47px] border border-[#B287FF] rounded-[10px] ">
          <Image
            src={"/images/Vector (15).png"}
            width={33.39}
            height={23.48}
            alt="social-icon"
          />
        </div>
        <div className="h-[47.99px] flexcenter w-[54.47px] border border-[#B287FF] rounded-[10px] ">
          <Image
            src={"/images/Vector (16).png"}
            width={33.39}
            height={23.48}
            alt="social-icon"
          />
        </div>
        <div className="h-[47.99px] flexcenter w-[54.47px] border border-[#B287FF] rounded-[10px] ">
          <Image
            src={"/images/Vector (17).png"}
            width={33.39}
            height={23.48}
            alt="social-icon"
          />
        </div>
      </div>
    </div>
  );
}
