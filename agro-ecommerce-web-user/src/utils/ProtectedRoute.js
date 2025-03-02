


import { useSelector } from "react-redux";
import { Navigate, Route } from "react-router-dom";

const ProtectedRoute = ({ path, element: Component, ...rest }) => {
  const { isAuthenticated } = useSelector((state) => state.auth); 

  return (
    <Route 
      path={path} 
      element={isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" replace />}
    />
  );
};

export default ProtectedRoute;