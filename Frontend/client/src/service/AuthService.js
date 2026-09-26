// const url_local="http://localhost:8080";
const url_production="https://billing-webapp-2.onrender.com";



import axios from "axios";

export const login=async (data)=>{
    return await axios.post(`${url_production}/api/v1.0/login`,data);
}