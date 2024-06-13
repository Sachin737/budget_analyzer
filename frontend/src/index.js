import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { AuthProvider } from "./Context/auth";
import { UserDataProvider } from "./Context/userData";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserDataProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </UserDataProvider>
  </React.StrictMode>
);

