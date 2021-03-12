import { Redirect, Route as RRDRoute, RouteProps } from 'react-router-dom';
import { isNil } from 'lodash';
import { useAuth } from '../auth';
import { Route } from '../../config/routing';
import { Role } from '../graphql/types';

const PublicRoute = ({ children, ...rest }: RouteProps) => {
  const { user } = useAuth();
  return (
    <RRDRoute {...rest}>
      {isNil(user) || user.role !== Role.Admin ? (
        children
      ) : (
        <Redirect to={Route.UsersPage} />
      )}
    </RRDRoute>
  );
};

export default PublicRoute;
