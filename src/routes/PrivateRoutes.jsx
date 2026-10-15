import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoutes = () => {
    const token = localStorage.getItem("token");
    const location = useLocation();

    if (!token) {
        const redirect = encodeURIComponent(
            location.pathname + location.search
        );
        return <Navigate to={`/login?redirect=${redirect}`} replace />;
    }

    return <Outlet />;
};

export default PrivateRoutes;
