import { Route, Redirect, RouteProps } from 'react-router-dom';
import { isNil } from 'lodash';
import { useAuth } from '../auth';
import { Role } from 'config/app';
import { ROUTE } from 'config/routing';

const AdminRoute = ({ children, ...rest }: RouteProps) => {
  const { user } = useAuth();
  return (
    <Route {...rest}>
      {!isNil(user) && user.role === Role.Admin ? (
        children
      ) : (
        <Redirect to={ROUTE.SIGN_IN_PAGE} />
      )}
    </Route>
  );
};

export default AdminRoute;
