import { createContext, useState } from 'react';

const NetworkContext = createContext({
  index: 1,
  _setIndex: (_index:number) => {},
});

interface Props {
  children: JSX.Element | JSX.Element[];
}

const NetworkProvider = ({ children }: Props): JSX.Element => {
  const [index, setIndex] = useState(1);
  
  const _setIndex = (_index:number):void => {
    setIndex(_index);
  };

  return (
    <NetworkContext.Provider
      value={{
        index,
        _setIndex,
      }}>
      {children}
    </NetworkContext.Provider>
  );
};

export { NetworkContext, NetworkProvider };