import Sidebarbtn from "./Sidebarbtn";

export default function Sidebar() {
  return (
    <div  className="max-w-[343.91px]  overflow-auto scrollbar-hide w-full h-screen overflow-scrow   shadow-[1px_0px_4px_0px_#A6A6A640]">
      {/* Header */}
      <div className="w-full h-full items-start flex flex-col  justify-between">

     <div>
      <p className="h-[79.88px] sm:h-[104.72px]  Xirod text-[var(--mutant-color)] text-[16px] sm:text-[24px] flex items-center justify-center leading-[40px]">
        Mutant
      </p>

      {/* Content */}
      <div style={{padding:'10px'}} className="h-full w-fit flex flex-col px-5 py-4  ">
        <div className=" gap-4  flex flex-col ">
          <div>
            <p className="font-semibold text-[15px] leading-[20px] text-[var(--side-textcolor)]">
              CORE NAVIGATION
            </p>
            <Sidebarbtn image="/images/sidebaricons/Group (3).png" text="Dashboard" />
            <Sidebarbtn image="/images/sidebaricons/Group (3).png" text="My Missions" />
          </div>

          <div>
            <p className="font-semibold text-[15px] leading-[20px] text-[var(--side-textcolor)]">
              STUDENT ENGAGEMENT
            </p>
            <Sidebarbtn image="/images/sidebaricons/Group (8).png" text="My Recruits" />
            <Sidebarbtn image="/images/sidebaricons/Group (7).png" text="Comms Center" />
            <Sidebarbtn image="/images/sidebaricons/Vector (10).png" text="Squad Discussions" />
          </div>

          <div>
            <p className="font-semibold text-[15px] leading-[20px] text-[var(--side-textcolor)]">
              PERFORMANCE AND FEEDBACK
            </p>
            <Sidebarbtn image="/images/sidebaricons/Group (6).png" text="Mission Analytics" />
            <Sidebarbtn image="/images/sidebaricons/Group (5).png" text="Field Reports" />
            <Sidebarbtn image="/images/sidebaricons/Group (5).png" text="Achievements" />
          </div>

          <div>
            <p className="font-semibold text-[15px] leading-[20px] text-[var(--side-textcolor)]">
              MONETIZATION AND EARNINGS
            </p>
            <Sidebarbtn image="/images/sidebaricons/Layer_1.png" text=" The Vault" />
          </div>

          <div>
            <p className="font-semibold text-[15px] leading-[20px] text-[var(--side-textcolor)]">
              SUPPORT ROOM
            </p>
            <Sidebarbtn image="/images/sidebaricons/Group (4).png" text="Knowledge Codex" />
            <Sidebarbtn image="/images/sidebaricons/Vector (10).png" text="Contact Command" />
          </div>
        </div>

        
      </div>
      </div>






      <div>
        {/* Logout at bottom */}
        <div style={{paddingLeft:'10px'}} className="self-bottom">
          <Sidebarbtn image="/images/sidebaricons/Layer_1 (1).png" text="Logout" />
        </div>
      </div>

      </div>


      
    </div>
  );
}
