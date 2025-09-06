export default function Page(params) {
    return (
      <div style={{ padding: "16px" }} className="h-full w-full bg-[#0F0F0F] ">
        <p className="sm:font-[600] sm:text-[26px] sm:leading-[150%] ">
          Security Settings
        </p>
        <div style={{padding:'0 16px'}} className="w-full h-[121.39px] flex items-center justify-between bg-[#0F0F0F] rounded-[8px] shadow-[0px_0px_9px_0px_#B2B2B221] ">
          <div>
            <p className="sm:font-[600] sm:text-[19px] sm:leading-[150%]  ">
              Change Password
            </p>
            <p className="text-[#4B4B4B] sm:font-[400] sm:text-[16px] sm:leading-[150%] ">
              Set a unique password to protect your lab
            </p>
          </div>

          <button className=" sm:font-[700] sm:text-[15px] cursor-pointer  sm:leading-[150%] bg-[#840B94] h-[46.35px] rounded-[8px] w-[174.56px]  ">
            Change Password
          </button>
        </div>
      </div>
    );
}