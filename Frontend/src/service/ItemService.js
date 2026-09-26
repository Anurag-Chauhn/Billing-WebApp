import axios from "axios";
// const url_local="http://localhost:8080";
const url_production="https://billing-webapp-2.onrender.com";


export const addItem = async (item) => {
    return await axios.post(`${url_production}/api/v1.0/admin/items`, item,{headers:{'Authorization':`Bearer ${localStorage.getItem("token")}`}});

}

export const deleteItem = async (itemId) => {
    return axios.delete(`${url_production}/api/v1.0/admin/items/${itemId}`,{headers:{'Authorization':`Bearer ${localStorage.getItem("token")}`}});
}


export const fetchItems = async () => {
    return await axios.get(`${url_production}/api/v1.0/items`,{headers:{'Authorization':`Bearer ${localStorage.getItem("token")}`}});
}