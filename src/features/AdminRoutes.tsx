import { Switch, Route as RRDRoute } from 'react-router-dom';
import { Route } from '../config/routing';
import AppLayout from 'common/AppLayout/AppLayout';
import UsersPage from './UsersPage/UsersPage';
import ProfessionsPage from './ProfessionsPage/ProfessionsPage';
import QualificationsPage from './QualificationsPage/QualificationsPage';
import QuestionsPage from './QuestionsPage/QuestionsPage';

function AdminRoutes() {
  return (
    <AppLayout>
      <Switch>
        <RRDRoute exact path={Route.UsersPage}>
          <UsersPage />
        </RRDRoute>
        <RRDRoute exact path={Route.ProfessionsPage}>
          <ProfessionsPage />
        </RRDRoute>
        <RRDRoute exact path={Route.QualificationsPage}>
          <QualificationsPage />
        </RRDRoute>
        <RRDRoute exact path={Route.QuestionsPage}>
          <QuestionsPage />
        </RRDRoute>
      </Switch>
    </AppLayout>
  );
}

export default AdminRoutes;
