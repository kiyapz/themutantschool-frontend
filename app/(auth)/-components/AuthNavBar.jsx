import { HiMenu } from "react-icons/hi";

export default function AuthNavBar() {
    return (
        <div className="sm:hidden">
        <div className="sm:hidden w-full flexcenter h-[10vh] ">
           <div className="  max-w-[300px]   h-[10vh] w-full flex items-center justify-between px  ">
             <p className="Xirod text-[15px] px leading-[57px] text-[var(--primary)] ">Mutant</p>
            <p className="w-[22.79px] h-[14.5px] px"><HiMenu size={24} /></p>
            </div>
        </div>

        </div>
    )
}