import axios from "axios";

// const url_local="http://localhost:8080";
const url_production="https://billing-webapp-2.onrender.com";


export const creatRazorpayOrder = async (data) => {
    return await axios.post(`${url_production}/api/v1.0/payment/create-order`,data,{headers:{'Authorization':`Bearer ${localStorage.getItem("token")}`}});
}


export const verifyPayment = async (paymentData) => {
    return await axios.post(`${url_production}/api/v1.0/payment/verify`,paymentData,{headers:{'Authorization':`Bearer ${localStorage.getItem("token")}`}});
}