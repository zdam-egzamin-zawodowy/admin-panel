export enum Route {
  SignInPage = '/',
  UsersPage = '/users',
  ProfessionsPage = '/professions',
  QualificationsPage = '/qualifications',
  QuestionsPage = '/questions',
}

export const PUBLIC_ROUTES = [Route.SignInPage];
export const ADMIN_ROUTES = Object.values(Route).filter(
  route => !PUBLIC_ROUTES.includes(route as Route)
);
