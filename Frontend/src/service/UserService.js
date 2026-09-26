import axios from "axios";


// const url_local="http://localhost:8080";
const url_production="https://billing-webapp-2.onrender.com";



export const addUser = async (user) => {
    return await axios.post(`${url_production}/api/v1.0/admin/register`, user,{headers:{'Authorization':`Bearer ${localStorage.getItem("token")}`}});

}

export const deleteUser = async (userId) => {
    return axios.delete(`${url_production}/api/v1.0/admin/users/${userId}`,{headers:{'Authorization':`Bearer ${localStorage.getItem("token")}`}});
}


export const fetchUsers = async () => {
    return await axios.get(`${url_production}/api/v1.0/admin/users`,{headers:{'Authorization':`Bearer ${localStorage.getItem("token")}`}});
}