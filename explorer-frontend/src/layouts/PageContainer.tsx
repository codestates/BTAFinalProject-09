import { FC, PropsWithChildren } from 'react';
import { Container } from '@mui/material';
import NavBar from '../components/NavBar';

const PageContainer: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Container>
      <NavBar />
      {children}
    </Container>
  );
};

export default PageContainer;
