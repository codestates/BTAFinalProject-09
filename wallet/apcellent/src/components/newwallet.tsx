import React, { useContext, useEffect, useState } from 'react';
import './styles/newwallet.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import { AptosAccount, FaucetClient, HexString } from "aptos";
import common from "../common";
import * as sha256 from "fast-sha256";
import { useNavigate } from 'react-router-dom';
import { NetworkContext } from '../context';
import { WalletClient } from "../api/wallet";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


const NewWallet = () => {
  
  const [mnemonic, setMnemonic] = useState(""); 
  const [checked, setChecked] = useState(false);
  const [cpwdFlag, setCpwdFlag] = useState(false);
  const [name, setName] = useState(""); //name
  const [pwd, setPwd] = useState(""); //password 
  const [cpwd, setCPwd] = useState(""); //cpassword
  const { index } = useContext(NetworkContext);
  const navigate = useNavigate();
  const bip39 = require('bip39');

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  

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
      createWallet();
  }

  const createWallet = async()  =>{
    handleOpen()
    const walletClient = new WalletClient(common.GetNetWork(index), common.GetFaucetNetWork(index));
    const info = await walletClient.createWallet(mnemonic);
    await chrome.storage.local.set({"info": new Array(info.accounts[0])});
    await chrome.storage.local.set({"mnemonic": mnemonic});
    chrome.storage.local.get(["info"], (result) => {
      console.log(result["info"])
      console.log(WalletClient.getAccountFromMnemonic(mnemonic).toPrivateKeyObject());
      console.log(WalletClient.getAccountFromMnemonic(mnemonic))
    });

    //faucet test 삭제 해도됨 
    const faucetClient = new FaucetClient(common.GetNetWork(index), common.GetFaucetNetWork(index)); // <:!:section_1
    await faucetClient.fundAccount(info.accounts[0].address,100_000_000);
    handleClose()
    //계정 목록 추가
    await chrome.storage.local.set({"accountList": new Array(info.accounts[0])}) 
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
      <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 4 }}
          open={open}>
          <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default NewWallet;

