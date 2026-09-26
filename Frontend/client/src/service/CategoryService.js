import axios from "axios";
// const url_local="http://localhost:8080";
const url_production="https://billing-webapp-2.onrender.com";


export const addCategory=async (category)=>{
    return await axios.post(`${url_production}/api/v1.0/admin/categories`,category,{headers:{'Authorization':`Bearer ${localStorage.getItem("token")}`}});

}

export const deleteCategory=async (categoryId)=>{
    return await axios.delete(`${url_production}/api/v1.0/admin/categories/${categoryId}`,{headers:{'Authorization':`Bearer ${localStorage.getItem("token")}`}});

}

export const fetchCategories=async ()=>{
    return await axios.get(`${url_production}/api/v1.0/categories`,{headers:{'Authorization':`Bearer ${localStorage.getItem("token")}`}});

}

