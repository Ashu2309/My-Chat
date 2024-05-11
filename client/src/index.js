import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import UserState from './context/UserState';

// Replace ReactDOM.render with createRoot
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserState>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </UserState>
    </BrowserRouter>
  </React.StrictMode>
);
