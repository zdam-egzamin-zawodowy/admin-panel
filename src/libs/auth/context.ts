import { createContext, useContext } from 'react';
import { AuthContext } from './types';
import TokenStorage from '../tokenstorage/TokenStorage';

const ctx = createContext<AuthContext>({
  tokenStorage: new TokenStorage(),
  signIn: () => new Promise(resolve => resolve(null)),
  signOut: () => new Promise(resolve => resolve()),
  loading: true,
  user: null,
});
ctx.displayName = 'AuthContext';

const useAuth = (): AuthContext => {
  return useContext(ctx);
};

export { ctx as context, useAuth };
