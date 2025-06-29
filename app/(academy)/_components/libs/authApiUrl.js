import axios from "axios";

const 	authApiUrl = axios.create({
  baseURL: "https://themutantschool-backend.onrender.com/api/institution/",
    headers: {
        "Content-Type": "application/json",
    },
    // timeout: 10000, 
   
});

export default 	authApiUrl;
