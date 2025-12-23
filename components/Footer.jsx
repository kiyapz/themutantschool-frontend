import Image from "next/image";
import Link from "next/link";

export default function Footer(params) {
  return (
    <div className="min-h-[60vh] sm:min-h-[82vh] flex-1 bg-black flexcenter flex-col gap-3 sm:gap-5 w-full px-4 py-8 sm:py-12">
      <p className="font-[400] text-center text-[32px] sm:text-[55px] leading-[40px] sm:leading-[117%]">
        MUTANT
      </p>
      <p className="text-center max-w-[284.03px] sm:max-w-[484.03px] w-full font-[600] text-[18px] sm:text-[30px] leading-[24px] sm:leading-[36px] px-4">
        The Mutant School is for the ones who never fit the mold. And never
        planned to.
      </p>
      <div className="w-full flex justify-center">
        <ul className="text-[#EB8AF2] text-[14px] sm:text-[17px] leading-[28px] sm:leading-[36px] flex flex-wrap items-center justify-center gap-3 sm:gap-5 cursor-pointer font-[300] px-4">
          <li>
            <Link href="/terms-and-conditions" className="hover:text-[#C314FF] transition-colors whitespace-nowrap">
              Terms & Conditions
            </Link>
          </li>
          <li>
            <Link href="/privacy-policy" className="hover:text-[#C314FF] transition-colors whitespace-nowrap">
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link href="/refund-policy" className="hover:text-[#C314FF] transition-colors whitespace-nowrap">
              Refund Policy
            </Link>
          </li>
          <li>
            <Link href="/faq" className="hover:text-[#C314FF] transition-colors whitespace-nowrap">
              FAQ
            </Link>
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-3 sm:gap-5 flex-wrap justify-center">
        <a
          href="https://www.facebook.com/TheMutantSchool/"
          target="_blank"
          rel="noopener noreferrer"
          className="h-[40px] sm:h-[47.99px] flexcenter w-[45px] sm:w-[54.47px] border border-[#B287FF] rounded-[10px] hover:border-[#C314FF] transition-colors cursor-pointer"
        >
          <Image
            src={"/images/Vector (14).png"}
            width={33.39}
            height={23.48}
            alt="Facebook"
            className="w-[28px] sm:w-[33.39px] h-auto"
          />
        </a>
        <a
          href="https://www.instagram.com/themutantschool"
          target="_blank"
          rel="noopener noreferrer"
          className="h-[40px] sm:h-[47.99px] flexcenter w-[45px] sm:w-[54.47px] border border-[#B287FF] rounded-[10px] hover:border-[#C314FF] transition-colors cursor-pointer"
        >
          <Image
            src={"/images/Vector (15).png"}
            width={33.39}
            height={23.48}
            alt="Instagram"
            className="w-[28px] sm:w-[33.39px] h-auto"
          />
        </a>
        <a
          href="http://linkedin.com/company/themutantschool"
          target="_blank"
          rel="noopener noreferrer"
          className="h-[40px] sm:h-[47.99px] flexcenter w-[45px] sm:w-[54.47px] border border-[#B287FF] rounded-[10px] hover:border-[#C314FF] transition-colors cursor-pointer"
        >
          <Image
            src={"/images/Vector (16).png"}
            width={33.39}
            height={23.48}
            alt="LinkedIn"
            className="w-[28px] sm:w-[33.39px] h-auto"
          />
        </a>
        <a
          href="https://www.youtube.com/@TheMutantSchool"
          target="_blank"
          rel="noopener noreferrer"
          className="h-[40px] sm:h-[47.99px] flexcenter w-[45px] sm:w-[54.47px] border border-[#B287FF] rounded-[10px] hover:border-[#C314FF] transition-colors cursor-pointer"
        >
          <Image
            src={"/images/Vector (17).png"}
            width={33.39}
            height={23.48}
            alt="YouTube"
            className="w-[28px] sm:w-[33.39px] h-auto"
          />
        </a>
      </div>
      <p className="text-center text-white text-xs sm:text-sm md:text-base mt-4 sm:mt-6 mb-2 sm:mb-4 px-4">
        © 2025 The Mutant School. All rights reserved.
      </p>
    </div>
  );
}
