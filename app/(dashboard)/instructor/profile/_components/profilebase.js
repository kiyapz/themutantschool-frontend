import axios from "axios";

const profilebase = axios.create({
  baseURL: "https://themutantschool-backend.onrender.com/api",
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

export default 	profilebase;
