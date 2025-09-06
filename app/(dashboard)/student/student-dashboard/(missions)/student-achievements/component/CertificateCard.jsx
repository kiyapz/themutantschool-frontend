'use client'
import Image from "next/image";
import React from "react";

const CertificateCard = ({ title, date, imageUrl, downloadLink }) => {
  return (
    <div className="bg-[#0C0C0C] rounded-xl p-4 md:p-6 grid lg:grid-cols-3 items-center shadow-lg gap-4 w-full max-w-6xl mx-auto">
      <div className="w-full">
        <Image
          src={"/images/students-images/certificate.png"}
          width={1377}
          height={85.1498031616211}
          alt="mutant-robot"
        />
      </div>

      <div className="col-span-2  space-y-3">
        <h3 className=" md:text-[40px] font-[600] leading-[48px] ">{title}</h3>
        <p className=" text-[27px] font-[200] italic leading-[40px]  ">
          Completed {date}
        </p>
        <a
          href={downloadLink}
          download
          className="inline-block h-[54.19px] flexcenter w-[243.47px] rounded-[10px] bg-gradient-to-r from-[#840B94] to-[#FF8D01]  text-white text-sm px-4 py-2 rounded transition"
        >
          ⬇ Download Certificate
        </a>
      </div>
    </div>
  );
};

export default CertificateCard;
