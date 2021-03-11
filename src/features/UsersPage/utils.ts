import { Role } from '../../libs/graphql/types';

export const formatRole = (r: Role): string =>
  r === Role.Admin ? 'Admin' : 'Użytkownik';
