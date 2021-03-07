import TokenStorage from '../tokenstorage/TokenStorage';

export type User = {
  id: number;
  displayName: string;
  role: UserRole;
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
