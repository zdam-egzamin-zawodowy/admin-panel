import React from 'react';
import { AuthContext } from './types';
import TokenStorage from '../tokenstorage/TokenStorage';

const ctx = React.createContext<AuthContext>({
  tokenStorage: new TokenStorage(),
  signIn: () => new Promise(resolve => resolve(null)),
  signOut: () => new Promise(resolve => resolve()),
  loading: true,
  user: null,
});
ctx.displayName = 'AuthContext';

const useAuth = (): AuthContext => {
  return React.useContext(ctx);
};

export { ctx as context, useAuth };
