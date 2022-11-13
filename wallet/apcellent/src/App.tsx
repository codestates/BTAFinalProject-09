import { createHashRouter, RouterProvider } from 'react-router-dom';
import { NetworkProvider } from './context';
import Home from './components/home';
import Main from './components/main';
import './App.css';
import Header from './components/header';
import NewWallet from './components/newwallet';
import Standby from './components/standby';
import RecoverWallet from './components/recoverwallet';
import ImportWallet from './components/importwallet';
import SendToken from './components/sendtoken';
import Test from './components/test';

const router = createHashRouter([
  {
    path: '/a',
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
  },
  {
    path: '/sendtoken',
    element: <SendToken/>
  },
  {
    path: '/',
    element: <Test/>

  }
])

const App = () => {
  return (
    <div className='App'>
      <NetworkProvider>
        <Header/>
        <RouterProvider router={router} />
      </NetworkProvider>
    </div>
  );
};

export default App;
