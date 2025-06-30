'use client';
import Link from "next/link";
import Sidebarbtn from "./Sidebarbtn";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="max-w-[343.91px] overflow-auto scrollbar-hide w-full h-screen shadow-[1px_0px_4px_0px_#A6A6A640]">
      <div className="w-full h-full flex flex-col justify-between">
        <div>
          <p className="h-[79.88px] sm:h-[104.72px] Xirod text-[var(--mutant-color)] text-[16px] sm:text-[24px] flex items-center justify-center leading-[40px]">
            Mutant
          </p>

          <div style={{ padding: '10px' }} className="w-fit flex flex-col px-5 py-4">
            <div className="gap-4 flex flex-col">
              
              {/* Core Nav */}
              <div>
                <p className="font-semibold text-[15px] text-[var(--side-textcolor)]">CORE NAVIGATION</p>
                <Link href="/instructor">
                  <Sidebarbtn
                    image="/images/sidebaricons/Group (3).png"
                    text="Dashboard"
                    active={pathname === "/instructor"}
                  />
                </Link>
                <Link href="/instructor/myMissions">
                  <Sidebarbtn
                    image="/images/sidebaricons/Group (3).png"
                    text="My Missions"
                    active={pathname === "/instructor/myMissions"}
                  />
                </Link>
              </div>

              {/* Engagement */}
              <div>
                <p className="font-semibold text-[15px] text-[var(--side-textcolor)]">STUDENT ENGAGEMENT</p>
                <Sidebarbtn
                  image="/images/sidebaricons/Group (8).png"
                  text="My Recruits"
                  active={pathname === "/instructor/recruits"}
                />
                <Sidebarbtn
                  image="/images/sidebaricons/Group (7).png"
                  text="Comms Center"
                  active={pathname === "/instructor/comms"}
                />
                <Sidebarbtn
                  image="/images/sidebaricons/Vector (10).png"
                  text="Squad Discussions"
                  active={pathname === "/instructor/discussions"}
                />
              </div>

              {/* Performance */}
              <div>
                <p className="font-semibold text-[15px] text-[var(--side-textcolor)]">PERFORMANCE AND FEEDBACK</p>
                <Sidebarbtn
                  image="/images/sidebaricons/Group (6).png"
                  text="Mission Analytics"
                  active={pathname === "/instructor/analytics"}
                />
                <Sidebarbtn
                  image="/images/sidebaricons/Group (5).png"
                  text="Field Reports"
                  active={pathname === "/instructor/reports"}
                />
                <Sidebarbtn
                  image="/images/sidebaricons/Group (5).png"
                  text="Achievements"
                  active={pathname === "/instructor/achievements"}
                />
              </div>

              {/* Monetization */}
              <div>
                <p className="font-semibold text-[15px] text-[var(--side-textcolor)]">MONETIZATION AND EARNINGS</p>
                <Sidebarbtn
                  image="/images/sidebaricons/Layer_1.png"
                  text="The Vault"
                  active={pathname === "/instructor/vault"}
                />
              </div>

              {/* Support */}
              <div>
                <p className="font-semibold text-[15px] text-[var(--side-textcolor)]">SUPPORT ROOM</p>
                <Sidebarbtn
                  image="/images/sidebaricons/Group (4).png"
                  text="Knowledge Codex"
                  active={pathname === "/instructor/codex"}
                />
                <Sidebarbtn
                  image="/images/sidebaricons/Vector (10).png"
                  text="Contact Command"
                  active={pathname === "/instructor/contact"}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Logout */}
        <div style={{ paddingLeft: '10px' }} className="self-bottom">
          <Sidebarbtn
            image="/images/sidebaricons/Layer_1 (1).png"
            text="Logout"
            active={pathname === "/logout"}
          />
        </div>
      </div>
    </div>
  );
}
