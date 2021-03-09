import { Switch, Route } from 'react-router-dom';
import { ROUTE } from '../config/routing';
import AppLayout from 'common/AppLayout/AppLayout';
import DashboardPage from './DashboardPage/DashboardPage';
import UsersPage from './UsersPage/UsersPage';

function AdminRoutes() {
  return (
    <AppLayout>
      <Switch>
        <Route exact path={ROUTE.DASHBOARD_PAGE}>
          <DashboardPage />
        </Route>
        <Route exact path={ROUTE.USERS_PAGE}>
          <UsersPage />
        </Route>
      </Switch>
    </AppLayout>
  );
}

export default AdminRoutes;
