import React from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import Home from './components/home';
import './App.css';
import Header from './components/header';
import NewWallet from './components/newwallet';

const router = createHashRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/newwallet',
    element: <NewWallet/>
  }
])

const App = () => {
  return (
    <div className='App'>
      <Header/>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
