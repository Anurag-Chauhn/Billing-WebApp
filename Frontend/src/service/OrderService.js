import axios from "axios";

// const url_local="http://localhost:8080";
const url_production="https://billing-webapp-2.onrender.com";


export const latestOrders = async () => {
    return await axios.get(`${url_production}/api/v1.0/orders/latest`,{headers:{'Authorization':`Bearer ${localStorage.getItem("token")}`}});
}

export const creatOrder = async (order) => {
    return await axios.post(`${url_production}/api/v1.0/orders`,order,{headers:{'Authorization':`Bearer ${localStorage.getItem("token")}`}});
}


export const deleteOrder = async (orderId) => {
    return await axios.delete(`${url_production}/api/v1.0/orders/${orderId}`,{headers:{'Authorization':`Bearer ${localStorage.getItem("token")}`}});
}