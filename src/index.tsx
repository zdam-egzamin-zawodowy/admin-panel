import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import App from './features/App';
import { AuthProvider } from './libs/auth';
import ThemeProvider from './libs/material-ui/ThemeProvider';
import TokenStorage from './libs/tokenstorage/TokenStorage';
import createClient from './libs/graphql/createClient';
import { API_URI } from './config/api';
import reportWebVitals from './reportWebVitals';

const tokenStorage = new TokenStorage();

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={createClient(API_URI, tokenStorage)}>
      <ThemeProvider>
        <AuthProvider tokenStorage={tokenStorage}>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
