import axios from "axios";

const createNewMission = axios.create({
  baseURL: "https://themutantschool-backend.onrender.com/api/mission",
  headers: {
    "Content-Type": "application/json",
  },
  // timeout: 10000,
});

export default createNewMission;
