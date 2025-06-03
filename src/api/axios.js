import axios from "axios";
const BASE_URL = 'https://ecomm-server.azurewebsites.net'
const LOCAL_URL = import.meta.env.VITE_SERVER_URL

export default axios.create({
    baseURL:LOCAL_URL,
    withCredentials:true
})
export const axiosPrivate = axios.create({
    baseURL:LOCAL_URL,
    headers:{'Content-Type': 'application/json'},
    withCredentials: true
})