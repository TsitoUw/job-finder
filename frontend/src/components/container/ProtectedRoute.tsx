import { Navigate, Outlet, useLocation } from "react-router-dom";
import { usePocket } from "../../context/pocketBaseContext";

const ProtectedRoute = ({ reversed }: { reversed?: boolean }) => {
  const location = useLocation();
  const { user } = usePocket();
  if (!user && !reversed) 
    return <Navigate to="/signup" state={{ from: location }} replace />;
  if (user && reversed)
    return <Navigate to="/" state={{ from: location }} replace />;
  return <Outlet />;
};

export default ProtectedRoute;
