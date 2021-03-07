import { Route, Redirect, RouteProps } from 'react-router-dom';
import { isNil } from 'lodash';
import { useAuth } from '../auth';
import { ROUTE } from '../../config/routing';

const PublicRoute = ({ children, ...rest }: RouteProps) => {
  const { user } = useAuth();
  return (
    <Route {...rest}>
      {isNil(user) ? children : <Redirect to={ROUTE.DASHBOARD_PAGE} />}
    </Route>
  );
};

export default PublicRoute;
