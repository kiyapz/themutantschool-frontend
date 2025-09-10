"use client";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { InstructorContext } from "../_components/context/InstructorContex";
import { Editprofilebtn } from "./profilesetting/_components/Editprofilebtn";
import { EditprofileRadiobtn } from "./profilesetting/_components/EditprofileRadiobtn";
import ToggleButton from "./notification/_components/ToggleButton";
import profilebase from "./_components/profilebase";
import UserProfileImage from "./_components/UserProfileImage";
import { useRouter } from "next/navigation"; // Fixed import for Next.js 13+ App Router

export default function Profile() {
  const router = useRouter();
  const {
    profiledisplay,
    setprofiledisplay,
    userUpdatedValue,
    setUserUpdatedValue,
    userProfile,
    setUserProfile,
    FetchUserProfile,
    user,
    setUser,
  } = useContext(InstructorContext);

  const [activeTab, setActiveTab] = useState("Personal");
  const [openEditProfile, setEditProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user profile on component mount
  useEffect(() => {
    async function fetchProfile() {
      setIsLoading(true);
      setError(null);

      try {
        const storedUser = localStorage.getItem("USER");
        const accessToken = localStorage.getItem("login-accessToken");

        if (!storedUser || !accessToken) {
          console.warn("User or token not found in localStorage");
          router.push("/auth/login");
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        const id = parsedUser._id;

        const response = await profilebase.get(`/user-profile/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        console.log("User profile fetched:", response.data.data);
        setUserProfile(response.data.data);
      } catch (error) {
        console.error(
          "Failed to load user profile:",
          error.response?.data || error.message
        );
        setError("Failed to load profile. Please try again.");

        if (error.response?.status === 401 || error.response?.status === 403) {
          router.push("/auth/login");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [setUserProfile, router]);

  useEffect(() => {
    if (userProfile) {
      setUserUpdatedValue({
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
        username: userProfile.username || "",
        email: userProfile.email || "",
        bio: userProfile.profile?.bio || "",
        facebook: userProfile.profile?.socialLinks?.facebook || "",
        linkedin: userProfile.profile?.socialLinks?.linkedin || "",
        website: userProfile.profile?.socialLinks?.website || "",

        twitter: userProfile.profile?.socialLinks?.twitter || "",
        instagram: userProfile.profile?.socialLinks?.instagram || "",
        youtube: userProfile.profile?.socialLinks?.youtube || "",
        url: userProfile.profile?.avatar?.url || "",
        publicId: userProfile.profile?.avatar?.publicId || "",
        Headline: userProfile.profile?.headline || "",
        introVideo: userProfile.profile?.introVideo || "",
        ExpertiseTags: userProfile.ExpertiseTags || [],
        gender: userProfile.gender || "",
        phoneNumber: userProfile.phoneNumber || "", // FIX: Map phoneNumber to Phone
        role: userProfile.role || "",
        nationality: userProfile.nationality || "",
        preferredLanguage: userProfile.preferredLanguage || "", // FIX: Use consistent field name
        dateOfBirth: userProfile.dateOfBirth
          ? userProfile.dateOfBirth.split("T")[0]
          : "", // FIX: Format date for input
      });
    }
  }, [userProfile, setUserUpdatedValue]);

  const updateUserProfile = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const storedUser = localStorage.getItem("USER");
      const accessToken = localStorage.getItem("login-accessToken");

      if (!storedUser || !accessToken) {
        setError("Authentication required. Please log in again.");
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      const id = parsedUser._id;

      const updateData = {
        firstName: userUpdatedValue.firstName || "",
        lastName: userUpdatedValue.lastName || "",
        username: userUpdatedValue.username || "",
        email: userUpdatedValue.email || "",
        gender: userUpdatedValue.gender || "",
        phoneNumber: userUpdatedValue.phoneNumber || "",
        role: userUpdatedValue.role || "",
        nationality: userUpdatedValue.nationality || "",
        preferredLanguage: userUpdatedValue.preferredLanguage || "",
        dateOfBirth: userUpdatedValue.dateOfBirth || "",
        ExpertiseTags: userUpdatedValue.ExpertiseTags || [],

        profile: {
          bio: userUpdatedValue.bio || "",
          headline: userUpdatedValue.Headline || "",
          introVideo: userUpdatedValue.introVideo || "",
          socialLinks: {
            facebook: userUpdatedValue.facebook || "",
            linkedin: userUpdatedValue.linkedin || "",
            website: userUpdatedValue.website || "",
            twitter: userUpdatedValue.twitter || "",
            instagram: userUpdatedValue.instagram || "",
            youtube: userUpdatedValue.youtube || "",
          },
          avatar: {
            url: userUpdatedValue.url || "",
            publicId: userUpdatedValue.publicId || "",
          },
        },
      };

      console.log("Sending update data:", updateData);

      const response = await profilebase.put(
        `/user-profile/${id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Profile updated successfully:", response.data.data);

      setUserProfile(response.data.data);
      setEditProfile(false);
    } catch (error) {
      console.error(
        "Failed to update user profile:",
        error.response?.data || error.message
      );
      setError("Failed to update profile. Please try again.");

      if (error.response?.status === 401 || error.response?.status === 403) {
        router.push("/auth/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !userProfile) {
    return (
      <div className="h-fit w-full max-w-[1200px] flex items-center justify-center">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  if (error && !userProfile) {
    return (
      <div className="h-fit w-full max-w-[1200px] flex flex-col items-center justify-center gap-4">
        <div className="text-red-500">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="bg-[var(--purpel-btncolor)] px-4 py-2 rounded-md text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-fit w-full max-w-[1200px] flex flex-col gap-[10px]">
      <p className="hidden sm:block text-[var(--sidebar-hovercolor)] font-[600] text-[42px] leading-[40px]">
        My Profile
      </p>
      <p className="hidden sm:block text-[var(--small-textcolor)] text-[13px] font-[600] leading-[40px]">
        You can update your personal details here
      </p>

      <div
        style={{ background: "linear-gradient(to right, #592BC3, #952CC5)" }}
        className="h-[218.12px] w-full rounded-b-[40px] sm:hidden"
      ></div>
      <div
        style={{ marginBottom: "5px", margin: "auto" }}
        className="h-fit w-[95%] relative z-10 top-[-80px] sm:top-[10px]"
      >
        <div className="grid w-full gap-3 xl:grid-cols-4">
          {/* Side Bar */}
          <div
            style={{
              paddingLeft: "35px",
              paddingTop: "40px",
              paddingRight: "10px",
            }}
            className="bg-[var(--black-background)] flex flex-col space-y-[20px] hidden xl:block"
          >
            <Link href="/instructor/profile">
              <div
                onClick={() => setprofiledisplay("Personal Information")}
                className={`${
                  profiledisplay === "Personal Information"
                    ? "text-[#8D5FCA]"
                    : "text-[var(--coco-color)]"
                } hover:text-[#8D5FCA] cursor-pointer w-full flex items-center justify-between text-[15px] leading-[150%] font-[600]`}
              >
                Personal Information
                <p>{`>`}</p>
              </div>
            </Link>
            <Link href="/instructor/profile/notification">
              <div
                onClick={() => setprofiledisplay("Notifications")}
                style={{ marginTop: "20px", marginBottom: "20px" }}
                className={`${
                  profiledisplay === "Notifications"
                    ? "text-[#8D5FCA]"
                    : "text-[var(--coco-color)]"
                } hover:text-[#8D5FCA] flex items-center justify-between cursor-pointer text-[15px] leading-[150%] font-[600]`}
              >
                Notifications
                <p>{`>`}</p>
              </div>
            </Link>
            <Link href="/instructor/profile/profilesetting">
              <div
                onClick={() => setprofiledisplay("Security Settings")}
                className={`${
                  profiledisplay === "Security Settings"
                    ? "text-[#8D5FCA]"
                    : "text-[var(--coco-color)]"
                } hover:text-[#8D5FCA] flex items-center justify-between cursor-pointer text-[15px] leading-[150%] font-[600]`}
              >
                Security Settings
                <p>{`>`}</p>
              </div>
            </Link>
          </div>

          {/* Personal Profile */}
          <div
            style={{ padding: "15px" }}
            className="flex bg-[var(--black-background)] flex-col gap-5 sm:col-span-3 h-fit w-full"
          >
            <div className="w-full flex items-end xl:items-center justify-between">
              <div className="flex flex-col xl:flex-row xl:items-center gap-3">
                <div className="h-[100px] w-[100px] relative left-[10px] sm:left-0 xl:h-[190px] xl:w-[190px] rounded-full border-[11px] bg-pink-200">
                  <UserProfileImage />
                </div>

                <div>
                  <p className="font-[600] text-[26px] sm:text-[35px] leading-[150%]">
                    {userUpdatedValue?.firstName || "First"}{" "}
                    <span>{userUpdatedValue?.lastName || "Last"}</span>
                  </p>
                  <p className="text-[17px] text-[var(--button-border-color)] sm:text-[24px] leading-[150%] sm:text-[var(--greencolor)]">
                    {userUpdatedValue?.Headline || "Product Designer || Tutor"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (FetchUserProfile) {
                    FetchUserProfile();
                  }
                  setEditProfile(true);
                }}
                disabled={isLoading}
                style={{ paddingLeft: "8px", paddingRight: "8px" }}
                className="bg-[var(--purpel-btncolor)] w-fit cursor-pointer flexcenter gap-1 rounded-[10px] text-[8px] sm:text-[14px] leading-[40px] font-[700] disabled:opacity-50"
              >
                <span>
                  <FiEdit size={8} />
                </span>
                {isLoading ? "Loading..." : "Edit Profile"}
              </button>
            </div>

            {/* divider */}
            <div className="bg-[#323232] w-full h-[1px]"></div>

            {/* bio */}
            <div>
              <p className="font-[700] text-[17px] leading-[40px]">Bio</p>
              <div className="w-full h-[100px] overflow-auto scrollbar-hide">
                <p className="text-[11px] xl:text-[16px] leading-[20px]">
                  {userUpdatedValue?.bio || "No bio available"}
                </p>
              </div>
            </div>

            {/* divider */}
            <div className="bg-[#323232] w-full h-[1px]"></div>

            {/* Profile */}
            <div className="w-full">
              <p className="font-[700] text-[17px] leading-[40px]">
                Personal Information
              </p>
              <div className="grid grid-cols-2 w-full items-center">
                <div className="text-[#ADA5A5] font-[700] text-[13px] xl:text-[19px] leading-[40px]">
                  Email Address
                </div>
                <div className="text-[#818181] xl:text-[18px] leading-[20px] text-[8px]">
                  {userUpdatedValue?.email || "N/A"}
                </div>
                <div className="text-[#ADA5A5] font-[700] text-[13px] xl:text-[19px] leading-[40px]">
                  Phone Number
                </div>
                <div className="text-[#818181] xl:text-[18px] leading-[20px] text-[8px]">
                  {userUpdatedValue?.phoneNumber || "N/A"}
                </div>
                <div className="text-[#ADA5A5] font-[700] text-[13px] xl:text-[19px] leading-[40px]">
                  Gender
                </div>
                <div className="text-[#818181] xl:text-[18px] leading-[20px] text-[8px]">
                  {userUpdatedValue?.gender || "N/A"}
                </div>
                <div className="text-[#ADA5A5] font-[700] text-[13px] xl:text-[19px] leading-[40px]">
                  Nationality
                </div>
                <div className="text-[#818181] xl:text-[18px] leading-[20px] text-[8px]">
                  {userUpdatedValue?.nationality || "N/A"}
                </div>
                <div className="text-[#ADA5A5] font-[700] text-[13px] xl:text-[19px] leading-[40px]">
                  Date Of Birth
                </div>
                <div className="text-[#818181] xl:text-[18px] leading-[20px] text-[8px]">
                  {userUpdatedValue?.dateOfBirth || "N/A"}
                </div>
                <div className="text-[#ADA5A5] font-[700] text-[13px] xl:text-[19px] leading-[40px]">
                  Preferred Language
                </div>
                <div className="text-[#818181] xl:text-[18px] leading-[20px] text-[8px]">
                  {userUpdatedValue?.preferredLanguage || "N/A"}
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="w-full">
              <p className="font-[700] text-[17px] leading-[40px]">
                Social Links
              </p>
              <div className="grid grid-cols-2 w-full">
                <div className="text-[#ADA5A5] font-[700] text-[13px] xl:text-[19px] leading-[40px]">
                  Personal Website
                </div>
                <div className="text-[#818181] xl:text-[18px] leading-[20px] text-[12px]">
                  {userUpdatedValue?.website || "N/A"}
                </div>
                <div className="text-[#ADA5A5] font-[700] text-[13px] xl:text-[19px] leading-[40px]">
                  LinkedIn
                </div>
                <div className="text-[#818181] xl:text-[18px] leading-[20px] text-[12px]">
                  {userUpdatedValue?.linkedin || "N/A"}
                </div>
                <div className="text-[#ADA5A5] font-[700] text-[13px] xl:text-[19px] leading-[40px] text-[12px]">
                  Instagram
                </div>
                <div className="text-[#818181] xl:text-[18px] leading-[20px] text-[12px]">
                  {userUpdatedValue?.instagram || "N/A"}
                </div>
                <div className="text-[#ADA5A5] font-[700] text-[13px] xl:text-[19px] leading-[40px]">
                  X
                </div>
                <div className="text-[#818181] xl:text-[18px] leading-[20px] text-[12px]">
                  {userUpdatedValue?.twitter || "N/A"}
                </div>
                <div className="text-[#ADA5A5] font-[700] text-[13px] xl:text-[19px] leading-[40px]">
                  Facebook
                </div>
                <div className="text-[#818181] xl:text-[18px] leading-[20px] text-[12px]">
                  {userUpdatedValue?.facebook || "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {openEditProfile && (
        <div
          style={{ padding: "20px" }}
          className="fixed inset-0 w-full h-full flex justify-center items-start sm:items-center overflow-auto bg-[rgba(0,0,0,0.9)] z-50 p-4"
        >
          <div
            style={{ padding: "15px" }}
            className="max-w-[900px] w-full flex flex-col gap-6 bg-[#101010] shadow-lg rounded-lg my-8 p-8"
          >
            <div className="flex items-center justify-between">
              <p className="text-white text-xl font-semibold">Update Profile</p>
              {error && <div className="text-red-500 text-sm">{error}</div>}
            </div>

            {/* Navigation bar */}
            <div>
              <ul className="flex items-center gap-3 border-b border-[#4D4D4D]">
                {["Personal", "Professional", "Social Links & Media"].map(
                  (tab) => (
                    <li
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{ paddingBottom: "20px" }}
                      className={`cursor-pointer px-4 text-[12px] sm:text-[15px] py-2 font-semibold relative
                                            ${
                                              activeTab === tab
                                                ? "text-[#8D5FCA]"
                                                : "text-[#D2D2D2]"
                                            }
                                            hover:text-[#8D5FCA] transition-colors duration-200
                                        `}
                    >
                      {tab}
                      {activeTab === tab && (
                        <span className="absolute left-0 -bottom-[1px] w-full h-[2px] bg-[#8D5FCA] rounded-md"></span>
                      )}
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Personal Tab */}
            {activeTab === "Personal" && (
              <div className="h-fit flex flex-col gap-5">
                <div className="w-full grid sm:grid-cols-2 gap-5">
                  <div>
                    <Editprofilebtn
                      value={userUpdatedValue?.firstName || ""}
                      onChange={(e) =>
                        setUserUpdatedValue({
                          ...userUpdatedValue,
                          firstName: e.target.value,
                        })
                      }
                      label="First Name"
                    />

                    <Editprofilebtn
                      value={userUpdatedValue?.username || ""}
                      onChange={(e) =>
                        setUserUpdatedValue({
                          ...userUpdatedValue,
                          username: e.target.value,
                        })
                      }
                      label="Username"
                    />

                    <Editprofilebtn
                      value={userUpdatedValue?.phoneNumber || ""}
                      onChange={(e) =>
                        setUserUpdatedValue({
                          ...userUpdatedValue,
                          phoneNumber: e.target.value,
                        })
                      }
                      // placeholder={"12345"}
                      label="phoneNumber
"
                      type="number"
                    />
                    <Editprofilebtn
                      value={userUpdatedValue?.nationality || ""}
                      onChange={(e) =>
                        setUserUpdatedValue({
                          ...userUpdatedValue,
                          nationality: e.target.value,
                        })
                      }
                      label="Nationality"
                    />
                  </div>
                  <div className="flex flex-col gap-0">
                    <Editprofilebtn
                      value={userUpdatedValue?.email || ""}
                      onChange={(e) =>
                        setUserUpdatedValue({
                          ...userUpdatedValue,
                          email: e.target.value,
                        })
                      }
                      label="Email Address"
                      type="email"
                    />
                    <Editprofilebtn
                      value={userUpdatedValue?.lastName || ""}
                      onChange={(e) =>
                        setUserUpdatedValue({
                          ...userUpdatedValue,
                          lastName: e.target.value,
                        })
                      }
                      label="Last Name"
                    />
                    <div className="grid grid-cols-2 gap-5 w-full">
                      <div className="flex flex-col gap-3">
                        <p className="text-[#8C8C8C] font-[600] text-[15px] leading-[40px]">
                          Gender
                        </p>
                        <EditprofileRadiobtn
                          value="Male"
                          selectedValue={userUpdatedValue?.gender || ""}
                          onChange={(e) =>
                            setUserUpdatedValue({
                              ...userUpdatedValue,
                              gender: e.target.value,
                            })
                          }
                          label="Male"
                        />
                      </div>
                      <div className="self-end">
                        <EditprofileRadiobtn
                          selectedValue={userUpdatedValue?.gender || ""}
                          onChange={(e) =>
                            setUserUpdatedValue({
                              ...userUpdatedValue,
                              gender: e.target.value,
                            })
                          }
                          value="Female"
                          label="Female"
                        />
                      </div>
                    </div>
                    <Editprofilebtn
                      value={userUpdatedValue?.dateOfBirth || ""}
                      onChange={(e) =>
                        setUserUpdatedValue({
                          ...userUpdatedValue,
                          dateOfBirth: e.target.value,
                        })
                      }
                      label="Date Of Birth"
                      type="date"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <ToggleButton label="Display Full Name" />
                </div>
              </div>
            )}

            {/* Professional Tab */}
            {activeTab === "Professional" && (
              <>
                <div>
                  <div className="flex flex-col gap-3">
                    <label
                      htmlFor="bio"
                      className="text-[#8C8C8C] font-[600] text-[13px] sm:text-[15px] leading-[40px]"
                    >
                      Short Bio (About Me)
                    </label>
                    <textarea
                      style={{ padding: "10px" }}
                      name="bio"
                      onChange={(e) =>
                        setUserUpdatedValue({
                          ...userUpdatedValue,
                          bio: e.target.value,
                        })
                      }
                      placeholder="Tell us about yourself..."
                      value={userUpdatedValue?.bio || ""}
                      rows={5}
                      className="w-full rounded-[6px] bg-[#1F1F1F] outline-none px-4 py-3 text-white resize-none"
                    ></textarea>
                  </div>
                </div>
                <div>
                  <Editprofilebtn
                    value={userUpdatedValue?.Headline || ""}
                    onChange={(e) =>
                      setUserUpdatedValue({
                        ...userUpdatedValue,
                        Headline: e.target.value,
                      })
                    }
                    label="Headline"
                    placeholder="Product Designer || Tutor"
                  />
                  <Editprofilebtn
                    value={userUpdatedValue?.ExpertiseTags || ""}
                    onChange={(e) =>
                      setUserUpdatedValue({
                        ...userUpdatedValue,
                        ExpertiseTags: e.target.value,
                      })
                    }
                    label="Expertise Tags"
                    placeholder="UI/UX, Management"
                  />
                </div>
              </>
            )}

            {/* Social Links & Media Tab */}
            {activeTab === "Social Links & Media" && (
              <div className="h-fit">
                <div className="mb-5">
                  <Editprofilebtn
                    label="Intro video (must be a valid youtube embed link)"
                    onChange={(e) =>
                      setUserUpdatedValue({
                        ...userUpdatedValue,
                        youtube: e.target.value,
                      })
                    }
                    value={userUpdatedValue?.youtube || ""}
                    placeholder="e.g youtube.com/etienoekanem"
                  />
                </div>
                <div className="w-full grid sm:grid-cols-2 gap-5">
                  <div>
                    <Editprofilebtn
                      label="Facebook"
                      value={userUpdatedValue?.facebook || ""}
                      onChange={(e) =>
                        setUserUpdatedValue({
                          ...userUpdatedValue,
                          facebook: e.target.value,
                        })
                      }
                      placeholder="e.g facebook.com/etienoekanem"
                    />
                    <Editprofilebtn
                      label="Linkedin"
                      value={userUpdatedValue?.linkedin || ""}
                      onChange={(e) =>
                        setUserUpdatedValue({
                          ...userUpdatedValue,
                          linkedin: e.target.value,
                        })
                      }
                      placeholder="e.g linkedin.com/in/etienoekanem"
                    />
                    <Editprofilebtn
                      label="Instagram"
                      value={userUpdatedValue?.instagram || ""}
                      onChange={(e) =>
                        setUserUpdatedValue({
                          ...userUpdatedValue,
                          instagram: e.target.value,
                        })
                      }
                      placeholder="e.g instagram.com/etienoekanem"
                    />
                  </div>
                  <div className="flex flex-col gap-0 sm:block">
                    <Editprofilebtn
                      value={userUpdatedValue?.twitter || ""}
                      onChange={(e) =>
                        setUserUpdatedValue({
                          ...userUpdatedValue,
                          twitter: e.target.value,
                        })
                      }
                      label="X (formerly Twitter)"
                      placeholder="e.g x.com/etienoekanem"
                    />
                    <div className="grid grid-cols-2 sm:grid-cols-1 gap-0">
                      <Editprofilebtn
                        label="YouTube"
                        value={userUpdatedValue?.youtube || ""}
                        onChange={(e) =>
                          setUserUpdatedValue({
                            ...userUpdatedValue,
                            youtube: e.target.value,
                          })
                        }
                        placeholder="e.g youtube.com/etien..."
                      />
                      <Editprofilebtn
                        label="Personal Website"
                        value={userUpdatedValue?.website || ""}
                        onChange={(e) =>
                          setUserUpdatedValue({
                            ...userUpdatedValue,
                            website: e.target.value,
                          })
                        }
                        placeholder="e.g themutantsschool.c..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-5 mt-6">
              <button
                style={{ padding: "10px" }}
                onClick={updateUserProfile}
                disabled={isLoading}
                className="bg-[var(--purpel-btncolor)] px-6 py-2 cursor-pointer flex items-center justify-center gap-1 rounded-[10px] text-sm font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading ? "Updating..." : "Update Profile"}
              </button>
              <button
                style={{ padding: "10px" }}
                onClick={() => {
                  setEditProfile(false);
                  setError(null);
                }}
                disabled={isLoading}
                className="border border-[#4D4D4D] px-6 py-2 cursor-pointer flex items-center justify-center gap-1 rounded-[10px] text-sm font-bold text-[#D2D2D2] hover:bg-[#1A1A1A] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
