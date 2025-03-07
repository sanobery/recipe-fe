import { Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectCurrentToken } from "../../../components/redux/AuthSlice"

const PrivateRoute = () => {
    const token = useSelector(selectCurrentToken) // Get token from Redux store

    return token ? <Outlet /> : <Navigate to="/login" replace />
}

export default PrivateRoute
