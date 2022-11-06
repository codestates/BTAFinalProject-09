import styled from '@emotion/styled';
import { Button } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import logoImage from '../assets/logo.png';
import Row from './Row';

const NavLink = styled(Link)`
  text-decoration: none;
  color: #000000;

  > button {
    text-transform: none;
    font-size: 24px;
  }
`;

const NavBar = () => {
  return (
    <Row sx={{ p: 2 }}>
      <Image src={logoImage} alt="logo" />
      <Row gap={2}>
        <NavLink href="/transactions">
          <Button color="inherit">Transactions</Button>
        </NavLink>
        <NavLink href="/blocks">
          <Button color="inherit">Blocks</Button>
        </NavLink>
      </Row>
    </Row>
  );
};

export default NavBar;
