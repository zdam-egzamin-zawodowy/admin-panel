import { Route as RRDRoute, Redirect, RouteProps } from 'react-router-dom';
import { isNil } from 'lodash';
import { useAuth } from '../auth';
import { Role } from '../graphql/types';
import { Route } from 'config/routing';

const AdminRoute = ({ children, ...rest }: RouteProps) => {
  const { user } = useAuth();
  return (
    <RRDRoute {...rest}>
      {!isNil(user) && user.role === Role.Admin ? (
        children
      ) : (
        <Redirect to={Route.SignInPage} />
      )}
    </RRDRoute>
  );
};

export default AdminRoute;
