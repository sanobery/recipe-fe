import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { ComponentType } from "react";
import { selectCurrentToken } from "../../components/app/redux/AuthSlice";
import AuthRefresh from "./AuthRefresh";

const withAuth = <P extends object>(Component: ComponentType<P>) => {
    return (props: P) => {
        AuthRefresh();
        const token = useSelector(selectCurrentToken);
        return token ? <Component {...props} /> : <Navigate to="/recipe" replace />;
    };
};

export default withAuth;
