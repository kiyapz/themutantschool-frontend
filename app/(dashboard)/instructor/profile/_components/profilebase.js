import axios from "axios";

const profilebase = axios.create({
  baseURL: "https://themutantschool-backend.onrender.com/api",

});

export default 	profilebase;
