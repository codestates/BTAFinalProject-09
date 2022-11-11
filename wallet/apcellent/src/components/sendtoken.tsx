import { NODE_URL, FAUCET_URL} from "../common";
import { AptosClient, AptosAccount, CoinClient, FaucetClient } from "aptos";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import StoreIcon from '@mui/icons-material/Store';
import ReplyIcon from '@mui/icons-material/Reply';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TextField from "@mui/material/TextField";
import './styles/sendtoken.css';
import Button from "@mui/material/Button";


const SendToken = () => {
    return(
        <div className="sendtoken">
            <div className="title">Send Aptos</div>
            <TextField className='recipient_input'
                focused={true}
                size='small' 
                id="outlined-basic" 
                label="Recipient" 
                variant="outlined"/>
            <AccountBalanceWalletIcon className="amount_img"/>
            <div className="amount_text">4.999999</div>

            <div className="amount_type">Aptos</div>
            <TextField className='amount_input'
                focused={true}
                size='small' 
                id="outlined-basic" 
                label="Amount" 
                variant="outlined"/>
            <TextField className='memo_input'
                focused={true}
                size='small' 
                id="outlined-basic" 
                label="Memo (opinonal)" 
                variant="outlined"/>
            <div className="feeMenu">   
                <div className="fee">Fee</div>
                <div className="fee_text">0.017935</div>
                <div className="fee_type">Aptos</div>

                <div className="balance">Balance</div>
                <div className="balance_text">0.017935</div>
                <div className="balance_type">Aptos</div>

                <div className="balancetx">Balance after tx</div>
                <div className="balancetx_text">0.017935</div>
                <div className="balancetx_type">Aptos</div>
            </div>
            <TextField className='password_input'
                focused={true}
                size='small' 
                id="outlined-basic" 
                label="Password" 
                variant="outlined"/>
                
             <Button disabled={false}
                variant="contained" 
                className='button' 
                size='small' 
                fullWidth={true}>
                Enter Password
            </Button>
        </div>

    );
};  

export default SendToken;