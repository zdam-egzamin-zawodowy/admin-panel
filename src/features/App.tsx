import { Route, Switch } from 'react-router-dom';
import PublicRoute from '../libs/router/PublicRoute';
import AdminRoute from '../libs/router/AdminRoute';
import AppLoading from './AppLoading';
import SignInPage from './SignInPage/SignInPage';
import NotFoundPage from './NotFoundPage/NotFoundPage';
import AdminRoutes from './AdminRoutes';
import { ROUTE, ADMIN_ROUTES } from '../config/routing';

function App() {
  return (
    <AppLoading>
      <Switch>
        <PublicRoute exact path={ROUTE.SIGN_IN_PAGE}>
          <SignInPage />
        </PublicRoute>
        <AdminRoute exact path={ADMIN_ROUTES}>
          <AdminRoutes />
        </AdminRoute>
        <Route path="*">
          <NotFoundPage />
        </Route>
      </Switch>
    </AppLoading>
  );
}

export default App;
