import React from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import Home from './components/home';
import './App.css';

const router = createHashRouter([
  {
    path: `/`,
    element: <Home />,
  },
])

const App = () => {
  return (
    <div className='App'>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
