import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './styles/header.css';
import SettingsSharpIcon from '@mui/icons-material/SettingsSharp';

const Header = () => {
    return (
        <div className='header'>
            <div className='mainicon'></div>
            <div className='network'>mainnet</div>
            <SettingsSharpIcon className='setting' color='primary'/>
        </div>
      );

}
export default Header;