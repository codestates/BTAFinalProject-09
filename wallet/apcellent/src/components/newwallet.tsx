import React, { useEffect, useState } from 'react';
import './styles/newwallet.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import { AptosAccount, FaucetClient, HexString } from "aptos";
import { NODE_URL, FAUCET_URL} from "../common";
import * as sha256 from "fast-sha256";
import { useNavigate } from 'react-router-dom';

const NewWallet = () => {
  
  const [mnemonic, setMnemonic] = useState(""); 
  const [checked, setChecked] = useState(false);
  const [cpwdFlag, setCpwdFlag] = useState(false);
  const [name, setName] = useState(""); //name
  const [pwd, setPwd] = useState(""); //password 
  const [cpwd, setCPwd] = useState(""); //cpassword
  const navigate = useNavigate();
  const bip39 = require('bip39');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const handleChange_name = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  };

  const handleChange_pwd = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPwd(event.target.value);
  };

  const handleChange_cpwd = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCPwd(event.target.value)
  };

  const submit = async() =>{
    if(pwd === "")
      setCpwdFlag(true);
    else
      pwd === cpwd ? setCpwdFlag(false) : setCpwdFlag(true);
    
    if(name === "")
      setName("default")

      let convert = new Uint8Array(Buffer.from(pwd,'base64')); // let str = Buffer.from(key.secretKey).toString('base64');
      const hash = HexString.fromUint8Array(sha256.hash(convert)).toString();
      await chrome.storage.local.set({"walletname": name});
      await chrome.storage.local.set({"lock": hash});
      // chrome.storage.local.get(["lock"], (result) => {
      //   console.log(result["lock"])
      // });
      createWallet();
  }

  const createWallet = async()  =>{
    const account =  AptosAccount.fromDerivePath("m/44'/637'/0'/0'/0'",mnemonic);
    const info = account.toPrivateKeyObject();
    await chrome.storage.local.set({"info": info});
    // chrome.storage.local.get(["info"], (result) => {
    //   console.log(result["info"].address)
    // });
 
    //faucet test 삭제 해도됨 
    const faucetClient = new FaucetClient(NODE_URL, FAUCET_URL); // <:!:section_1
    await faucetClient.fundAccount(account.authKey(),100_000_000);
    navigate("/main")
  }

  useEffect(() => {
    let mnemonic: string = bip39.generateMnemonic();
    setMnemonic(mnemonic);
  }, []);

  return (
    <div className='newwallet'>
      <div className='title'>New Wallet</div>
      <TextField className='input_type' onChange={handleChange_name} focused={true} size='small' id="outlined-basic" label="Wallet name" variant="outlined" />
      <TextField className='input_type' onChange={handleChange_pwd} type={"password"} focused={true} size='small' style={{"top":220}} id="outlined-basic" label="Password" variant="outlined" />
      <TextField className='input_type' 
        error={cpwdFlag} 
        helperText={cpwdFlag ? "Password doesn't match" :""}
        onChange={handleChange_cpwd} 
        type={"password"} 
        focused={true} size='small' 
        style={{"top":285}} 
        id="outlined-basic" 
        label="Comfirm password" 
        variant="outlined" />
      <TextField className='input_type'  size='small' style={{"top":350}} id="outlined-basic" 
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
      <Button disabled={!checked} variant="contained" className='button' size='small' fullWidth={true} onClick={submit}>Submit</Button>
    </div>
  );
};

export default NewWallet;

