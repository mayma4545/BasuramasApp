import axios from "axios";
import {hostname, port, mainHost}  from './staticVar'

const axiosConfig = axios.create({
    baseURL:`${mainHost}`,
    timeout: 10000,
    headers:{
        "Content-Type": "application/json"
    }
})
axiosConfig.interceptors.request.use(
    config=>{
        return config
    },
    error=> {return Promise.reject(error)}
)

axiosConfig.interceptors.response.use(
    config =>{
        return config
    },
    error=> {return Promise.reject(error)}

)

export default axiosConfig