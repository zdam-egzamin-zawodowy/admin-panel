import { Redirect, Route, RouteProps } from 'react-router-dom';
import { isNil } from 'lodash';
import { useAuth } from '../auth';
import { ROUTE } from '../../config/routing';
import { Role } from '../../config/app';

const PublicRoute = ({ children, ...rest }: RouteProps) => {
  const { user } = useAuth();
  return (
    <Route {...rest}>
      {isNil(user) || user.role !== Role.Admin ? (
        children
      ) : (
        <Redirect to={ROUTE.DASHBOARD_PAGE} />
      )}
    </Route>
  );
};

export default PublicRoute;
