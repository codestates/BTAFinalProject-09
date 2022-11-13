import common from "../common";
import { AptosClient, AptosAccount, CoinClient, FaucetClient, HexString } from "aptos";
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TextField from "@mui/material/TextField";
import './styles/sendtoken.css';
import Button from "@mui/material/Button";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import * as sha256 from "fast-sha256";
import { WalletClient } from '../api/wallet';
import { NetworkContext } from "../context";


const SendToken = () => {
    const navigate = useNavigate();
    const decimals = 10**8;
    
    const [open, setOpen] = useState(false);
    const { index } = useContext(NetworkContext);
    const [address, setAddress] = useState(""); // to address 
    const [pwd, setPwd] = useState(""); //password 
    const [amount, setAmount] = useState(0); //amount 
    const [account,setAccount] = useState(Object); // account
    const [pwdHash,setPwdHash] = useState(); // account

    const [fee, setFee] = useState(0); // fee 
    const [balance, setBalance] = useState(0); // balnce 
    const [afterBalance, setAfterBalance] = useState(0); // after balnce 
    const walletClient = new WalletClient(common.GetNetWork(index), common.GetFaucetNetWork(index));

    useEffect(() => {
        chrome.storage.local.get(["info"], (result) => {
            setAccount(result["info"])
            walletClient.getBalance(result["info"].address).then((_balance)=>{
                setBalance(_balance / decimals);
            });
        }); 
        chrome.storage.local.get(["lock"], (result) => {
            setPwdHash(result["lock"])
        }); 
        
    }, []);

    const handleClose = () => {
      setOpen(false);
    };
    const handleToggle = () => {
      setOpen(!open);
    };

    const handleChange_address = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(event.target.value);
    };
    
    const handleChange_amount = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(parseFloat(event.target.value))
    };

    const handleChange_pwd = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPwd(event.target.value);
    };

    //valid
    const hasError = useMemo(() => {
        if(!address || !amount || amount < 0) {
            return true;
        }
        let convert = new Uint8Array(Buffer.from(pwd,'base64')); // let str = Buffer.from(key.secretKey).toString('base64');
        const hash = HexString.fromUint8Array(sha256.hash(convert)).toString();
        if(pwdHash !== hash) {
            return true;
        }
        return false;
    }, [pwd, address, amount]);

    // simulation 
    const simulation = useCallback(async() =>{
        // 현재 계정
        let _account = WalletClient.getAccountFromPrivateKey(account.privateKeyHex);
        let _fee = await walletClient.transfer_simulation(_account, address, (amount * decimals)); //1 aptos
        setFee(parseInt(_fee)/decimals);
        setAfterBalance((balance  - amount) - (parseInt(_fee) / decimals));
        console.log(balance - amount)
    }, [amount]);

    useEffect(() => {
        simulation()
    }, [simulation]);

    const sendTotoken = async() => {
        handleToggle()
        try{
            const _account = WalletClient.getAccountFromPrivateKey(account.privateKeyHex);
            walletClient.transfer(_account, address ,(amount * decimals)).then((result) =>{
                console.log(result)
                handleClose()
                navigate("/main")
            });
        }catch(e){
            console.log(e)
            handleClose()
        }
    }

    return(
        <div className="sendtoken">
            <div className="title">Send Aptos</div>
            <TextField className='recipient_input'
                focused={true}
                size='small' 
                id="outlined-basic" 
                label="Recipient" 
                variant="outlined"
                onChange={handleChange_address}
                />
            <AccountBalanceWalletIcon className="amount_img"/>
            <div className="amount_text">{balance}</div>

            <div className="amount_type">Aptos</div>
            <TextField className='amount_input'
                focused={true}
                size='small' 
                id="outlined-basic" 
                label="Amount" 
                variant="outlined"
                type="number"
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                onChange={handleChange_amount}
                />
            <TextField className='memo_input'
                focused={true}
                size='small' 
                id="outlined-basic" 
                label="Memo (opinonal)" 
                variant="outlined"/>
            <div className="feeMenu">   
                <div className="fee">Fee</div>
                <div className="fee_text">{fee}</div>
                <div className="fee_type">Aptos</div>

                <div className="balance">Balance</div>
                <div className="balance_text">{balance}</div>
                <div className="balance_type">Aptos</div>

                <div className="balancetx">Balance after tx</div>
                <div className="balancetx_text">{afterBalance}</div>
                <div className="balancetx_type">Aptos</div>
            </div>
            <TextField 
                className='password_input'
                focused={true}
                size='small' 
                id="outlined-basic" 
                label="Password" 
                variant="outlined"
                type={"password"}
                onChange={handleChange_pwd}/>
                
             <Button 
                disabled={hasError}
                onClick={sendTotoken}
                variant="contained" 
                className='button' 
                size='small' 
                fullWidth={true}>
                Enter Password
            </Button>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>

    );
};  

export default SendToken;