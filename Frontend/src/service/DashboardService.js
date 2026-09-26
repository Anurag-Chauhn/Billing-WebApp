import axios from "axios";

// const url_local="http://localhost:8080";
const url_production="https://billing-webapp-2.onrender.com";



export const fetchDashboardData = async () => {
    return await axios.get(`${url_production}/api/v1.0/dashboard`,{headers:{'Authorization':`Bearer ${localStorage.getItem("token")}`}});
}

