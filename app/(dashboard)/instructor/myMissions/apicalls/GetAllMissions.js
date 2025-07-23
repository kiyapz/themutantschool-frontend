// useEffect(() => {
    // console.log("use effect for fetching missions");
'use client';
import { useContext } from "react";
import { InstructorContext } from "../../_components/context/InstructorContex";
import profilebase from "../../profile/_components/profilebase";

   

    export default async function getAllMission() {
        const {  setMission } = useContext(InstructorContext);

         const storedUser = localStorage.getItem("USER");
         const parsedUser = JSON.parse(storedUser);
         const id = parsedUser._id;
      try {
        const response = await profilebase.get(`instructor/report/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "login-accessToken"
            )}`,
          },
        });

        if (response.status === 401) {
          console.log("Unauthorized access. Please log in again.");
          
          const refreshToken = localStorage.getItem("login-refreshToken");
          // make a reques to get new token
          const getToken = await profilebase.post(
            "auth/refresh-token",
            { refreshToken },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem(
                  "login-accessToken"
                )}`,
              },
            }
          );

          if (getToken.status === 200) {  
            localStorage.setItem("login-accessToken", getToken.data.accessToken);
            console.log("Access token refreshed successfully.");
            
            return getAllMission();
          }



          
        }

        console.log("fetched mission response", response.data.missions);
        setMission(response.data.missions);
      } catch (error) {
        console.log("Error fetching missions:", error);
      }
    }
    // getAllMission();
//   }, []);