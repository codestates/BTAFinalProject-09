import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './styles/newwallet.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';

const NewWallet = () => {
  
  const [mnemonic, setMnemonic] = useState("confirme confirme confirme confirme confirme confirme confirme confirme confirme confirme confirme confirme"); 
  const [checked, setChecked] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <div className='newwallet'>
      <div className='title'>New Wallet</div>
      <TextField className='input_type' size='small' id="outlined-basic" label="Wallet name" variant="outlined" />
      <TextField className='input_type' size='small' style={{"top":220}} id="outlined-basic" label="Password" variant="outlined" />
      <TextField className='input_type' size='small' style={{"top":285}} id="outlined-basic" label="Comfirm password" variant="outlined" />
      <TextField className='input_type' size='small' style={{"top":350}} id="outlined-basic" 
        label="Mnemonic" 
        variant="outlined" 
        multiline={true}
        rows={3}
        value={mnemonic}
        disabled={false}
        focused={false}/>
      <Checkbox 
        className='checkbox'
        checked={checked}
        onChange={handleChange}/>
      <div className='msg'>I have written down the mnemonic</div>
      <Button variant="contained" className='button' size='small' fullWidth={true} >Submit</Button>
    </div>
  );
};

export default NewWallet;

