import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setCredentials } from "../../../components/redux/AuthSlice"
import config from "../../components/app/api/config/config"

const AuthRefresh =()=>{
    const dispatch = useDispatch()

    useEffect(()=>{
        const getRefreshToken = async()=>{
            const response = await fetch(`${config.apiUrl}/auth/refresh`, {
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