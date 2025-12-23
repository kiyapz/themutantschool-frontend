"use client";
import Link from "next/link";
import Sidebarbtn from "./Sidebarbtn";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { InstructorContext } from "./context/InstructorContex";

export default function Sidebar() {
  const pathname = usePathname();
  const { handleLogout, isMobileMenuOpen, setIsMobileMenuOpen } =
    useContext(InstructorContext);

  return (
    <div className="w-full overflow-auto scrollbar-hide h-screen shadow-[1px_0px_4px_0px_#A6A6A640]">
      <div className="w-full h-full flex flex-col justify-between">
        <div>
          <p className="h-[79.88px] sm:h-[104.72px] Xirod text-[var(--mutant-color)] text-[16px] sm:text-[24px] flex items-center justify-center leading-[40px]">
            Mutant
          </p>

          <div className="w-full flex flex-col px-5 py-4">
            <div className="gap-4 flex flex-col">
              {/* Core Nav */}
              <div>
                <p className="font-semibold text-[15px] text-[var(--side-textcolor)] mb-2">
                  CORE NAVIGATION
                </p>
                <Link href="/instructor">
                  <Sidebarbtn
                    onClick={() => setIsMobileMenuOpen(false)}
                    image="/images/sidebaricons/Group (3).png"
                    text="Dashboard"
                    active={pathname === "/instructor"}
                  />
                </Link>
                <Link href="/instructor/missions">
                  <Sidebarbtn
                    onClick={() => setIsMobileMenuOpen(false)}
                    image="/images/sidebaricons/Group (3).png"
                    text="My Missions"
                    active={pathname === "/instructor/missions"}
                  />
                </Link>
              </div>

              {/* Engagement */}
              <div>
                <p className="font-semibold text-[15px] text-[var(--side-textcolor)] mb-2">
                  STUDENT ENGAGEMENT
                </p>
                <Link href="/instructor/recruits">
                  <Sidebarbtn
                    onClick={() => setIsMobileMenuOpen(false)}
                    image="/images/sidebaricons/Group (8).png"
                    text="My Recruits"
                    active={pathname === "/instructor/recruits"}
                  />
                </Link>
              </div>

              {/* Performance */}
              <div>
                <p className="font-semibold text-[15px] text-[var(--side-textcolor)] mb-2">
                  PERFORMANCE AND FEEDBACK
                </p>
                <Link href="/instructor/analytics">
                  <Sidebarbtn
                    onClick={() => setIsMobileMenuOpen(false)}
                    image="/images/sidebaricons/Group (6).png"
                    text="Mission Analytics"
                    active={pathname === "/instructor/analytics"}
                  />
                </Link>
              </div>

              {/* Monetization */}
              <div>
                <p className="font-semibold text-[15px] text-[var(--side-textcolor)] mb-2">
                  MONETIZATION AND EARNINGS
                </p>
                <Link href="/instructor/vault">
                  <Sidebarbtn
                    onClick={() => setIsMobileMenuOpen(false)}
                    image="/images/sidebaricons/Layer_1.png"
                    text="The Vault"
                    active={pathname === "/instructor/vault"}
                  />
                </Link>
              </div>

            </div>
          </div>
        </div>

        {/* Footer Logout */}
        <div
          onClick={handleLogout}
          style={{ paddingLeft: "10px" }}
          className="self-bottom"
        >
          <Sidebarbtn
            onClick={() => setIsMobileMenuOpen(false)}
            image="/images/sidebaricons/Layer_1 (1).png"
            text="Logout"
            active={pathname === "/logout"}
          />
        </div>
      </div>
    </div>
  );
}
