import axios from "axios";

const LevelBaseurl = axios.create({
  baseURL: "https://themutantschool-backend.onrender.com/api/",
  headers: {
    "Content-Type": "application/json",
  },
  // timeout: 10000,
});

export default LevelBaseurl;
