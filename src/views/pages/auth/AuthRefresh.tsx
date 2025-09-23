import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setCredentials } from "../../../store/AuthSlice"

const API_URL = import.meta.env.VITE_API_URL

const AuthRefresh =()=>{
    const dispatch = useDispatch()

    useEffect(()=>{
        const getRefreshToken = async()=>{
            const response = await fetch(`${API_URL}/auth/refresh`, {
                method: "GET",
                credentials: "include", // Allows cookies to be sent
            });
            const token = await response.json()            
            const result = token?.accessToken
            if(token){
                dispatch(setCredentials({accessToken:result}))
            }
        }
        getRefreshToken();
    },[dispatch])
}

export default AuthRefresh