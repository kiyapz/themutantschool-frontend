"use client";
import { default as NextImage } from "next/image";
import React, { useRef, useEffect } from "react";
import jsPDF from "jspdf";
import domtoimage from "dom-to-image";

// Define a style block to ensure Xirod font is embedded
const fontStyles = `
  @font-face {
    font-family: 'Xirod';
    src: url('/fonts/xirod.woff') format('woff');
    font-weight: normal;
    font-style: normal;
  }
  
  .Xirod {
    font-family: 'Xirod', sans-serif !important;
  }
`;

const CertificateCard = ({
  title,
  date,
  imageUrl,
  downloadLink,
  studentName,
  instructor = "AbdulRahman Assan",
}) => {
  const certificateRef = useRef(null);
  const fontStyleRef = useRef(null);

  // Inject font styles to ensure they're available for dom-to-image
  useEffect(() => {
    // Create a style element if it doesn't exist yet
    if (!fontStyleRef.current) {
      fontStyleRef.current = document.createElement("style");
      fontStyleRef.current.innerHTML = fontStyles;
      document.head.appendChild(fontStyleRef.current);
    }

    // Clean up on unmount
    return () => {
      if (fontStyleRef.current && fontStyleRef.current.parentNode) {
        fontStyleRef.current.parentNode.removeChild(fontStyleRef.current);
      }
    };
  }, []);

  const handleDownload = async (e) => {
    e.preventDefault();

    if (certificateRef.current) {
      try {
        // Show loading state
        e.target.textContent = "Preparing PDF...";

        // Preload the Xirod font to ensure it's available when creating the image
        const fontLoader = new FontFace("Xirod", `url('/fonts/xirod.woff')`);
        try {
          await fontLoader.load();
          document.fonts.add(fontLoader);
          console.log("Xirod font loaded successfully");
        } catch (fontError) {
          console.warn("Font preloading error:", fontError);
          // Continue anyway
        }

        // Apply inline styles directly to elements with Xirod class for capture
        const xirodElements = certificateRef.current.querySelectorAll(".Xirod");
        xirodElements.forEach((el) => {
          el.style.fontFamily = "'Xirod', sans-serif";
          el.style.fontWeight = "normal";
        });

        // Use dom-to-image with additional filter to fix font issues
        const imgData = await domtoimage.toPng(certificateRef.current, {
          quality: 1.0,
          bgcolor: "#000000",
          width: certificateRef.current.offsetWidth,
          height: certificateRef.current.offsetHeight,
          style: {
            // Force any problematic styles
            "background-image": "none",
          },
          fontEmbedCSS: fontStyles, // Include font CSS directly
        });

        // Create image for PDF
        const img = new window.Image();
        img.src = imgData;

        await new Promise((resolve) => {
          img.onload = resolve;
        });

        // Scale content to fit PDF without additional white spaces
        const contentWidth = img.width;
        const contentHeight = img.height;

        // Initialize PDF document based on content dimensions
        const pdf = new jsPDF({
          orientation: contentWidth > contentHeight ? "landscape" : "portrait",
          unit: "pt",
          format: [contentWidth, contentHeight],
        });

        // Add image to PDF
        pdf.addImage(imgData, "PNG", 0, 0, contentWidth, contentHeight);

        // Generate file name
        const fileName = `${studentName || "Certificate"}_${title.replace(
          /\s+/g,
          "_"
        )}.pdf`;

        // Save the PDF
        pdf.save(fileName);

        // Reset button text
        e.target.textContent = "⬇ Download Certificate (PDF)";
      } catch (error) {
        console.error("Error generating PDF certificate:", error);

        // Show error details to help debugging
        console.log("Error details:", error.message);

        e.target.textContent = "⬇ Download Certificate (PDF)";
        alert("Failed to generate PDF certificate. Please try again.");
      }
    }
  };

  return (
    <div className="bg-[#0C0C0C] rounded-xl p-4 md:p-6 grid grid-cols-1 items-center shadow-lg gap-4 w-full">
      <div className="w-full ">
        <div
          ref={certificateRef}
          className="relative w-full aspect-[1377/871] bg-center rounded-lg" // Using image aspect ratio
          style={{
            backgroundImage: `url('/images/students-images/newstudentcertificate.png')`,
            backgroundSize: "100% 100%",
          }}
        >
          <div className="absolute top-[9%] left-1/2 -translate-x-1/2 text-center">
            <p className="text-[#A0B0F8] Xirod text-[1vw] md:text-[0.8vw] lg:text-[10px] font-semibold tracking-[0.2em]">
              THE MUTANT SCHOOL
            </p>
          </div>

          <div className="absolute top-[18%] left-1/2 -translate-x-1/2 text-center">
            <p className="text-[#49B4B0] text-[1vw] md:text-[0.8vw] lg:text-[16px] tracking-[0.2em]">
              CERTIFICATE
            </p>
          </div>

          <div className="absolute top-[30%] left-1/2 -translate-x-1/2 text-center w-full px-4">
            <p className="text-white  font-bold text-[2.5vw] md:text-[2vw] lg:text-4xl">
              {studentName || "ETIENO EKANEM"}
            </p>
          </div>

          <div className="absolute top-[42%] left-1/2 -translate-x-1/2 text-center w-[80%]">
            <p className="text-gray-400 text-[1.2vw] text-center md:text-[1vw] lg:text-base">
              has successfully obtained this certificate for completing the
              course:
            </p>
          </div>

          <div className="absolute top-[55%] left-1/2 -translate-x-1/2 text-center w-full px-4">
            <p className="text-[#9D54B1]  font-semibold text-[1.8vw] md:text-[1.5vw] lg:text-2xl">
              {title}
            </p>
          </div>

          <div className="absolute top-[65%] left-1/2 -translate-x-1/2 text-center">
            <p className="text-white text-[1.2vw] md:text-[1vw] lg:text-sm">
              On {date}
            </p>
          </div>

          <div className="absolute bottom-[10%] left-[15%] text-center">
            <p className="text-white text-[1.2vw] md:text-[1vw] lg:text-base font-medium">
              {instructor}
            </p>
            <hr className="w-28 sm:w-36 md:w-40 my-1 border-gray-400" />
            <p className="text-gray-400 text-[0.9vw] md:text-[0.7vw] lg:text-[10px] tracking-widest uppercase">
              INSTRUCTOR
            </p>
          </div>

          <div className="absolute bottom-[10%] right-[15%] text-center">
            <p className="text-white text-[1.2vw] md:text-[1vw] lg:text-base font-medium">
              Shahad Av
            </p>
            <hr className="w-24 sm:w-32 md:w-40 my-1 border-gray-400" />
            <p className="text-gray-400 text-[0.9vw] md:text-[0.7vw] lg:text-[10px] tracking-widest uppercase">
              FOUNDER, THE MUTANT SCHOOL
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className=" md:text-[20px] font-[600] leading-[28px] ">{title}</h3>
        <p className=" text-[27px] font-[200] italic leading-[40px]  ">
          Completed {date}
        </p>
        <button
          onClick={handleDownload}
          className="inline-flex items-center justify-center h-[54.19px] w-[243.47px] rounded-[10px] bg-gradient-to-r from-[#840B94] to-[#FF8D01] text-white text-sm px-4 py-2 transition hover:opacity-90"
        >
          ⬇ Download Certificate (PDF)
        </button>
      </div>
    </div>
  );
};

export default CertificateCard;
