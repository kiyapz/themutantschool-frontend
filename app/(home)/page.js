import Navbar from "@/components/Navbar";
import { Clock, Star, User } from "lucide-react";

const studentcourse = [
  {
    id: 1,
    category: "Design",
    rating: 4.5,
    title: "Design Principles:",
    subtitle: "Beginners Course",
    duration: "5hr 22mins",
    instructor: "Sarah Johnson",
    students: 1250,
    image:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=200&fit=crop",
  },
  {
    id: 2,
    category: "Development",
    rating: 4.8,
    title: "React Fundamentals:",
    subtitle: "Complete Guide",
    duration: "8hr 45mins",
    instructor: "Mike Chen",
    students: 2340,
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop",
  },
  {
    id: 3,
    category: "Marketing",
    rating: 4.3,
    title: "Digital Marketing:",
    subtitle: "Strategy & Analytics",
    duration: "6hr 15mins",
    instructor: "Emma Davis",
    students: 890,
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop",
  },
];
export default function Home() {
  return (
    <div className="flex flex-col gap-5 items-center ">
      <div className="fixed top-0 left-0 w-full h-fit flexcenter flex-col hap-3 z-50">
        <div className="w-full   h-[70px] bg-[var(--primary-light)]"></div>

        {/* Nav Bar */}
        <div className="max-w-[1440px] px w-full h-full bg-black   ">
          <Navbar />
        </div>
      </div>

      {/* Herosection */}
      <div
        style={{
          backgroundImage: "url('/images/0_Tunnel_Neon_1920x1080 3.png')",
        }}
        className="h-screen flex items-center justify-center flex-col w-full bg-cover bg-center"
      >
        <div className="w-screen h-screen absolute top-0 z-40 left-0 bg-[rgba(0,0,0,0.7)] "></div>

        <div
          style={{ paddingTop: "10%" }}
          className="max-w-[336.97px]  relative herosection-mb flexcenter flex-col gap-5  sm:max-w-[500px] w-full  px-4"
        >
          <div className="absolute shadow-[-4px_4px_10px_rgba(255,192,203,0.5)] top-[38.5px] bottom-10 sm:bottom-0  h-[180px]  w-[80px] sm:h-[200px] z-10 h-[80px]  w-[80px] sm:w-[100px]">
            {" "}
          </div>
          <div className="absolute border-pink-100 border rotate-4 shadow-[-4px_-4px_10px_rgba(255,192,203,0.5)] top-[38.5px] sm:top-[42.1%]  h-[80px]  w-[80px] sm:h-[100px] z-20 h-[80px]  w-[80px] sm:w-[100px]"></div>
          <div className="absolute border-pink-100 border rotate-7 shadow-[-4px_-4px_10px_rgba(255,192,203,0.5)] top-[38.3px] sm:top-[42%]  h-[80px]  w-[80px] sm:h-[100px] z-20 h-[80px]  w-[80px] sm:w-[100px]"></div>
          <div className="absolute border-pink-100 border rotate-5  shadow-[-4px_-4px_10px_rgba(255,192,203,0.5)] top-[38.5px] sm:top-[42.5%]  h-[80px]  w-[80px] sm:h-[100px] z-20 h-[80px]  w-[80px] sm:w-[100px]"></div>

          <div className="relative z-40">
            <h2 className="Xirod text-[40px] sm:text-[60px] leading-[37px] sm:leading-[62px] text-center  ">
              YOU AIN’T{" "}
            </h2>
            <h2 className="bg-gradient-to-r from-[#7CD668] via-[#BDE75D] to-[#F5FFDF] bg-clip-text text-transparent Xirod text-[40px] leading-[40px] sm:text-[60px] sm:leading-[62px] text-center ">
              LIKE THE OTHERS
            </h2>
          </div>

          <p className="Xirod text-[14px] relative z-40 sm:text-[18px] leading-[14px] sm:leading-[70px] text-[var(--info)] text-center ">
            MUTANT GENE DETECTED
          </p>
          <div className="flexcenter relative z-40 h-[70px] w-fit evolution-button">
            <div className="evolution-button-inner flexcenter h-full w-full">
              <p className="font-[700] text-[17px] leading-[70px] ">
                START YOUR EVOLUTION
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* main section */}
      <div
        style={{ padding: "20px" }}
        className=" w-full max-w-[1440px] gap-10 sm:gap-0 flex flex-col sm:flex-row items-center justify-between "
      >
        <p className="font-[400] text-[23px] xl:text-[45px] leading-[27px] sm:leading-[52px] ">
          Most Wanted Missions
        </p>
        <button className="font-[700] cursor-pointer bg-white text-[20px] xl:text-[28px] text-black leading-[40px] xl:leading-[80px] w-[268.47px] xl:w-[380.2px] h-[83.92px] rounded-[17px] ">
          Explore More Missions
        </button>
      </div>

      {/* courses */}

      <div
        style={{ padding: "0 20px" }}
        className="max-w-[350px] sm:max-w-[1440px] w-full h-fit "
      >
        <div className="w-full grid sm:grid-cols-3 gap-6  ">
          {studentcourse.map((course, i) => (
            <div
              key={course.id}
              className="h-[529px] rounded-[20px] bg-[#0B1021] overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <div
                className="h-[195px] rounded-t-[20px] bg-gradient-to-br from-pink-100 to-purple-200 bg-cover bg-center relative"
                style={{
                  backgroundImage: `url(${course.image})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              <div
                style={{ padding: "20px" }}
                className="flex flex-col justify-between h-[334px] p-5"
              >
                <div className="flex flex-col gap-5">
                  <div className="flex w-full items-center justify-between">
                    <span
                      style={{ padding: "0 8px" }}
                      className="bg-[#393D4E] rounded-[8px] text-[#ABABAB] font-medium text-sm px-3 py-2"
                    >
                      {course.category}
                    </span>
                    <div
                      style={{ padding: "0 8px" }}
                      className="bg-[#D3D3D3] rounded-full px-3 py-1 flex items-center gap-1"
                    >
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-gray-800 font-medium text-sm">
                        {course.rating}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[#E8EDF6] font-semibold text-2xl leading-tight">
                      {course.title}
                    </h3>
                    <h4 className="text-[#E8EDF6] font-semibold text-2xl leading-tight">
                      {course.subtitle}
                    </h4>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1 text-[#6B6B6B]">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium text-sm">
                          {course.duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[#6B6B6B]">
                        <User className="w-4 h-4" />
                        <span className="font-medium text-sm">
                          {course.students} students
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#C314FF] to-[#6654BC] font-[600] text-[27px] leading-[35px] ">
                      $ 50
                    </p>
                  </div>
                  <button
                    style={{ padding: "0 8px" }}
                    className="bg-[#08E595]    px-6 py-2 rounded-[10px] font-medium transition-all duration-200 cursor-pointer hover:shadow-lg"
                  >
                    Enter Mission
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* choose mutant */}
      <div
        style={{ backgroundImage: `url("/images/Rectangle 158.png")` }}
        className="h-screen w-full relative max-w-[1400px] bg-center bg-cover"
      >
        <div className="absolute flexcenter w-full h-fit bg-[rgba(0,0,0,0.6)] z-20  ">
          <div className="w-[70%]  h-fit flex flex-col items-center gap-15 ">
            <div className="flexcenter flex-col">
              <p className="max-w-[488px] text-center w-full text-center font-[400] sm:text-[45px] leading-[45px] Xirod ">
                Choose your Mutation
              </p>
              <p className="text-center text-[#9F9F9F] sm:text-[18px] sm:leading-[35px] font-[600] ">
                Get ahead of them with top demand skills
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4 w-full">
              {/* Left Box */}
              <div className="h-[410px] flex flex-col items-center justify-center gap-10 rounded-[22px] bg-gradient-to-b from-[#1B1F2E] to-[#559463]">
                {/* <YourIcon className="text-white w-12 h-12" /> */}
                <p className="text-white text-xl">Design</p>
              </div>

              {/* Middle Box - Raised */}
              <div className="h-[410px] flex flex-col items-center justify-center gap-10 rounded-[22px] bg-gradient-to-b from-[#1B1F2E] to-[#559463] sm:relative -top-6">
                {/* <YourIcon className="text-white w-12 h-12" /> */}
                <p className="text-white text-xl">Code</p>
              </div>

              {/* Right Box */}
              <div className="h-[410px] flex flex-col items-center justify-center gap-10 rounded-[22px] bg-gradient-to-b from-[#1B1F2E] to-[#559463]">
                {/* <YourIcon className="text-white w-12 h-12" /> */}
                <p className="text-white text-xl">Marketing</p>
              </div>
            </div>

            <div>
              <button
                style={{ padding: "5px 20px" }}
                className="font-[800] sm:leading-[80px] bg-white rounded-[10px] sm:text-[27px] text-black "
              >
                Explore More Powers
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
