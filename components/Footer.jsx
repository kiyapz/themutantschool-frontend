import Image from "next/image";
import Link from "next/link";

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
          <li>
            <Link href="/terms-and-conditions" className="hover:text-[#C314FF] transition-colors">
              Terms & Conditions
            </Link>
          </li>
          <li>
            <Link href="/privacy-policy" className="hover:text-[#C314FF] transition-colors">
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link href="/refund-policy" className="hover:text-[#C314FF] transition-colors">
              Refund Policy
            </Link>
          </li>
          <li>
            <Link href="/faq" className="hover:text-[#C314FF] transition-colors">
              FAQ
            </Link>
          </li>
        </ul>
      </div>

      <div className=" flex items-center gap-5">
        <a
          href="https://www.facebook.com/TheMutantSchool/"
          target="_blank"
          rel="noopener noreferrer"
          className="h-[47.99px] flexcenter w-[54.47px] border border-[#B287FF] rounded-[10px] hover:border-[#C314FF] transition-colors cursor-pointer"
        >
          <Image
            src={"/images/Vector (14).png"}
            width={33.39}
            height={23.48}
            alt="Facebook"
          />
        </a>
        <a
          href="https://www.instagram.com/themutantschool"
          target="_blank"
          rel="noopener noreferrer"
          className="h-[47.99px] flexcenter w-[54.47px] border border-[#B287FF] rounded-[10px] hover:border-[#C314FF] transition-colors cursor-pointer"
        >
          <Image
            src={"/images/Vector (15).png"}
            width={33.39}
            height={23.48}
            alt="Instagram"
          />
        </a>
        <a
          href="http://linkedin.com/company/themutantschool"
          target="_blank"
          rel="noopener noreferrer"
          className="h-[47.99px] flexcenter w-[54.47px] border border-[#B287FF] rounded-[10px] hover:border-[#C314FF] transition-colors cursor-pointer"
        >
          <Image
            src={"/images/Vector (16).png"}
            width={33.39}
            height={23.48}
            alt="LinkedIn"
          />
        </a>
        <a
          href="https://www.youtube.com/@TheMutantSchool"
          target="_blank"
          rel="noopener noreferrer"
          className="h-[47.99px] flexcenter w-[54.47px] border border-[#B287FF] rounded-[10px] hover:border-[#C314FF] transition-colors cursor-pointer"
        >
          <Image
            src={"/images/Vector (17).png"}
            width={33.39}
            height={23.48}
            alt="YouTube"
          />
        </a>
      </div>
      <p className="text-center text-white text-sm sm:text-base mt-6 mb-4">
        © 2025 The Mutant School. All rights reserved.
      </p>
    </div>
  );
}
