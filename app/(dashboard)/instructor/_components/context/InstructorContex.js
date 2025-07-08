'use client';
import { createContext, useEffect, useState } from "react";
import profilebase from "../../profile/_components/profilebase";

export const InstructorContext = createContext();

export default function InstructorContextProvider({ children }) {
  const [profiledisplay, setprofiledisplay] = useState('Personal Information');
  const [openSmallScreenProfileDropDown,setopenSmallScreenProfileDropDown] = useState(false);
  const [openlargeProfileDropdown, setopenlargeProfileDropdown] = useState(false);
  const [ ChangePassword,setChangePassword] = useState(false)
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const [userUpdatedValue, setUserUpdatedValue] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        bio:"",
        facebook:"" ,
        linkedin:"",
        website:"" ,
        Twitter:"" ,
        url:"" ,
        youtube:"" ,
        instagram:"" ,
        Headline:"" ,
        ExpertiseTags:"",
        gender:"" ,
        Phone:"" ,
        role:"",
        nationality:""
      });

      //  useEffect(()=>{
              
      //        async function call() {
      //           try {
      //             const storedUser = localStorage.getItem("USER");
      //             const accessToken = localStorage.getItem("login-accessToken");
      //             console.log(accessToken, 'access token');
                  
      //             if (!storedUser || !accessToken) {
      //               console.log("User or token not found in localStorage");
      //               return;
      //             }
                  
      //             const parsedUser = JSON.parse(storedUser);
      //             const id = parsedUser._id;
      //             console.log(id, "this is userid");
                  
      //             const response = await profilebase.get(`/user-profile/${id}`, {
      //               headers: {
      //                 Authorization: `Bearer ${accessToken}`,
      //               },
      //             });
                  
      //             console.log("User profile exactly:", response.data.data);
      //             setUserProfile(response.data.data); 
                  
      //           } catch (error) {
      //             console.log("Failed to load user", error.response?.data || error.message);
      //           }
      //         }
        
      //         call()
        
      //       },[])

      //  useEffect(() => {
      //       if (userProfile) {
      //         setUserUpdatedValue({
      //           firstName: userProfile.firstName ,
      //           lastName: userProfile.lastName ,
      //           username: userProfile.username,
      //           email: userProfile.email ,
      //           bio:userProfile.profile.bio ,
      //           facebook:userProfile.profile.socialLinks.facebook ,
      //           linkedin:userProfile.profile.socialLinks.linkedin,
      //           website:userProfile.profile.socialLinks.website ,
      //           Twitter:userProfile.profile.socialLinks.Twitter ,
      //           url:userProfile.profile.avatar.url ,
      //           youtube:userProfile.profile.avatar.publicId ,
      //           instagram:userProfile?.profile.socialLinks.instagram ,
      //           Headline:userProfile.Headline ,
      //           ExpertiseTags:userProfile.ExpertiseTags ,
      //           gender:userProfile.gender ,
      //           Phone:userProfile.phone ,
      //           role:userProfile.role,
      //           nationality:userProfile.nationality
      
      //         });
      //       }
      //     }, [userProfile]);


       useEffect(() => {
              const getUser = async () => {
                  try {
      
                      const storedUser = localStorage.getItem("USER");
                      const accessToken = localStorage.getItem("login-accessToken");
                      
                      if (!storedUser || !accessToken) {
                          console.warn("User or token not found in localStorage");
                          router.push("/Login");
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
                      console.error("Failed to load user from localStorage:", error);
                  }
              };
      
              getUser();
          }, []);




      const FetchUserProfile = async () => {
        console.log("Clicked user profile");
        
        try {
          const storedUser = localStorage.getItem("USER");
          const accessToken = localStorage.getItem("login-accessToken");
          console.log(accessToken, 'access token');
          
          if (!storedUser || !accessToken) {
            console.warn("User or token not found in localStorage");
            return;
          }
          
          const parsedUser = JSON.parse(storedUser);
          const id = parsedUser._id;
          console.log(id, "this is userid");
          
          const response = await profilebase.get(`/user-profile/${id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          
          console.log("User profile exactly:", response.data.data);
          setUserProfile(response.data.data); 
          
          
        } catch (error) {
          console.log("Failed to load user", error.response?.data || error.message);
        }
      };
  return (
    <InstructorContext.Provider value={{FetchUserProfile,userProfile, setUserProfile,userUpdatedValue, setUserUpdatedValue,user, setUser,openlargeProfileDropdown, setopenlargeProfileDropdown, profiledisplay, setprofiledisplay,openSmallScreenProfileDropDown,setopenSmallScreenProfileDropDown,ChangePassword,setChangePassword }}>
      {children}
    </InstructorContext.Provider>
  );
}
