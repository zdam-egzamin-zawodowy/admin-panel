import { Switch, Route } from 'react-router-dom';
import { ROUTE } from '../config/routing';
import DashboardPage from './DashboardPage/DashboardPage';

function AdminRoutes() {
  return (
    <Switch>
      <Route exact path={ROUTE.DASHBOARD_PAGE}>
        <DashboardPage />
      </Route>
    </Switch>
  );
}

export default AdminRoutes;
