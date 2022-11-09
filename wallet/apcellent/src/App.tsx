import React from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import Home from './components/home';
import Main from './components/main';
import './App.css';
import Header from './components/header';
import NewWallet from './components/newwallet';
import Standby from './components/standby';
import RecoverWallet from './components/recoverwallet';
import ImportWallet from './components/importwallet';

const router = createHashRouter([
  {
    path: '/',
    element: <Home/>,
  },
  {
    path: '/newWallet',
    element: <NewWallet/>
  },
  {
    path: '/main',
    element: <Main/>
  },
  {
    path: '/standby',
    element: <Standby/>
  },
  {
    path: '/recoverwallet',
    element: <RecoverWallet/>
  },
  {
    path: '/importwallet',
    element: <ImportWallet/>
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
