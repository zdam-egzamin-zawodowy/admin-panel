import TokenStorage from '../tokenstorage/TokenStorage';
import { User as _User, Maybe } from 'libs/graphql/types';

export type User = Omit<_User, 'activated'>;

export interface AuthContext {
  user: Maybe<User>;
  tokenStorage: TokenStorage;
  signIn: (
    email: string,
    password: string,
    staySignedIn: boolean,
    validate?: (user: User) => boolean
  ) => Promise<Maybe<User>>;
  signOut: () => Promise<void>;
  loading: boolean;
}
