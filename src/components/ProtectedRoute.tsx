import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { PUBLIC_ROUTES } from '../utils/constants';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  if (!user && !PUBLIC_ROUTES.includes(location.pathname)) {
    return <Navigate to="/authPage" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default PrivateRoute;