import React, { useMemo, useState, useEffect } from 'react';
import { useApolloClient } from '@apollo/client';
import { isFunction } from 'lodash';
import { context as Context } from './context';
import { AuthContext, User } from './types';
import TokenStorage from '../tokenstorage/TokenStorage';
import { QUERY_ME } from './queries';
import { MUTATION_SIGN_IN } from './mutations';

export interface AuthProviderProps {
  tokenStorage?: TokenStorage;
  children?: React.ReactNode;
}

type MeQueryResult = {
  me: User | null;
};

type SignInMutationResult = {
  token: string;
  user: User;
};

type SignInMutationVariables = {
  email: string;
  staySignedIn: boolean;
  password: string;
};

export function AuthProvider(props: AuthProviderProps) {
  const client = useApolloClient();
  const [user, setUser] = useState<AuthContext['user']>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const tokenStorage = useMemo(() => {
    if (props.tokenStorage) {
      return props.tokenStorage;
    }
    return new TokenStorage();
  }, [props.tokenStorage]);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    if (tokenStorage.token) {
      try {
        const result = await client.query<MeQueryResult>({
          query: QUERY_ME,
          fetchPolicy: 'network-only',
        });
        if (result.data.me) {
          setUser(result.data.me);
        }
      } catch (e) {}
    }
    setLoading(false);
  };

  const signIn: AuthContext['signIn'] = async (
    email: string,
    password: string,
    staySignedIn: boolean,
    validate?: (user: User) => boolean
  ) => {
    const result = await client.mutate<
      SignInMutationResult,
      SignInMutationVariables
    >({
      mutation: MUTATION_SIGN_IN,
      variables: {
        email,
        password,
        staySignedIn,
      },
    });

    if (result.data?.user) {
      if (isFunction(validate) && !validate(result.data?.user)) {
        return null;
      }
      tokenStorage.setToken(result.data.token);
      setUser(result.data.user);
      client.writeQuery<MeQueryResult>({
        query: QUERY_ME,
        data: {
          me: result.data.user,
        },
      });
      return result.data.user;
    }

    return null;
  };

  const signOut = () => {
    return client.clearStore().then(() => {
      tokenStorage.setToken('');
      setUser(null);
    });
  };

  return (
    <Context.Provider
      value={{
        user,
        tokenStorage,
        signIn,
        signOut,
        loading,
      }}
    >
      {props.children}
    </Context.Provider>
  );
}