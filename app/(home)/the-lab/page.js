import Categories from "./component/MutantSchoolCategories";

export default function Labs() {
  return (
    <div className="">
      {/* Herosection */}
      <div
        style={{
          backgroundImage: "url('/images/Rectangle 120.png')",
        }}
        className="h-screen relative z-20 flex items-center justify-center flex-col w-full bg-cover bg-center"
      >
        <div
          style={{ paddingTop: "10%" }}
          className="max-w-[336.97px] relative herosection-mb flexcenter flex-col gap-5 sm:max-w-[852.48px] w-full px-4"
        >
          <div className="relative z-40">
            <h2 className="text-[var(--text-light-2)] Xirod text-[24px] leading-[28px] xs:text-[32px] xs:leading-[36px] sm:text-[40px] sm:leading-[44px] md:text-[51px] md:leading-[57px] text-center">
              Welcome to The
            </h2>
            <h2 className="text-[var(--text-light-2)] Xirod text-[24px] leading-[28px] xs:text-[32px] xs:leading-[36px] sm:text-[40px] sm:leading-[44px] md:text-[51px] md:leading-[57px] text-center">
              Lab. Choose your
            </h2>
            <h2 className="text-[#7343B3] Xirod text-[24px] leading-[28px] xs:text-[32px] xs:leading-[36px] sm:text-[40px] sm:leading-[44px] md:text-[51px] md:leading-[57px] text-center">
              power.
            </h2>
          </div>

          <p className="font-[500] text-[12px] xs:text-[14px] relative z-40 sm:text-[17px] leading-[14px] sm:leading-[24px] md:leading-[28px] text-[var(--info)] text-center px-2">
            BEGIN YOUR MUTATION
          </p>
        </div>
      </div>
      <div
        style={{ padding: "20px 30px" }}
        className="w-screen flexcenter mx-auto bg-white flex-col h-fit "
      >
        <Categories />
      </div>
    </div>
  );
}
