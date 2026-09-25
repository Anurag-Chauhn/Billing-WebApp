import axios from "axios";

export const creatRazorpayOrder = async (data) => {
    return await axios.post("http://localhost:8000/api/v1.0/payment/create-order",data,{headers:{'Authorization':`Bearer ${localStorage.getItem("token")}`}});
}


export const verifyPayment = async (paymentData) => {
    return await axios.post(`http://localhost:8000/api/v1.0/payment/verify`,paymentData,{headers:{'Authorization':`Bearer ${localStorage.getItem("token")}`}});
}