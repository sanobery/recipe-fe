import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setCredentials } from "../../components/app/redux/AuthSlice"

const AuthRefresh =()=>{
    const dispatch = useDispatch()

    useEffect(()=>{
        const getRefreshToken = async()=>{
            let response = await fetch("http://localhost:3500/auth/refresh", {
                method: "GET",
                credentials: "include", // ✅ Allows cookies to be sent
            });
            let token = await response.json()            
            let result = token?.accessToken
            if(token){
                dispatch(setCredentials({accessToken:result}))
            }
        }
        getRefreshToken();
    },[dispatch])
}

export default AuthRefresh