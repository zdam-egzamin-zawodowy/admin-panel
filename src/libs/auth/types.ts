import TokenStorage from '../tokenstorage/TokenStorage';
import { Role } from 'config/app';

export type User = {
  id: number;
  displayName: string;
  role: Role;
  email: string;
};

export interface AuthContext {
  user: User | null;
  tokenStorage: TokenStorage;
  signIn: (
    email: string,
    password: string,
    staySignedIn: boolean,
    validate?: (user: User) => boolean
  ) => Promise<User | null>;
  signOut: () => Promise<void>;
  loading: boolean;
}
