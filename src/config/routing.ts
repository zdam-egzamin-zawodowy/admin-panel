export enum Route {
  SignInPage = '/',
  UsersPage = '/users',
  ProfessionsPage = '/professions',
}

export const PUBLIC_ROUTES = [Route.SignInPage];
export const ADMIN_ROUTES = Object.values(Route).filter(
  route => !PUBLIC_ROUTES.includes(route as Route)
);
