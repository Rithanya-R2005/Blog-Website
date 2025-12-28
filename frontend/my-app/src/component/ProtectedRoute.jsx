import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ value,children }) => {
  return value? children : <Navigate to="/login" />;
};

export default ProtectedRoute;