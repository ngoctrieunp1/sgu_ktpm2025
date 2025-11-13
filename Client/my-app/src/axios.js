// import axios from "axios"
// import {getToken} from "./Pages/Signup/LocalStorage/LocalDb"

// export const api=axios.create({
//     baseURL:"http://localhost:4000"
// })


// api.interceptors.request.use(config=>{
//     const token=getToken() || null
//     config.headers.Authorization=`Bearer ${token}`
//     return config
// })


import axios from "axios";
import { getToken } from "./Pages/Signup/LocalStorage/LocalDb";

const baseURL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:4000";

export const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = getToken() || null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
