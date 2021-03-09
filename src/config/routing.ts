export const ROUTE = {
  SIGN_IN_PAGE: '/',
  DASHBOARD_PAGE: '/dashboard',
  USERS_PAGE: '/users',
};

export const PUBLIC_ROUTES = [ROUTE.SIGN_IN_PAGE];
export const ADMIN_ROUTES = Object.values(ROUTE).filter(
  route => !PUBLIC_ROUTES.includes(route)
);
