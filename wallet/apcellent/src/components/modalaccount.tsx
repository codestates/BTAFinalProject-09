import React, { useState,useEffect } from 'react';
import './styles/main.css';
import { WalletClient } from "../api/wallet";
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Modalaccount = (props: any) => {
    const {pros_account} = props;
    const [caddress, setCaddress] = useState();
    useEffect(() => {
        chrome.storage.local.get(["info"], (result) => {
            setCaddress(result["info"][0].address)
        });
    }, []);
    console.log(pros_account)

    const checkAddress = async(index:number)=>{
        console.log(new Array(pros_account[index]))
        await chrome.storage.local.set({"info": new Array(pros_account[index])}); 
        window.location.reload();
    }

    return(
        pros_account.map((obj: any,index: any) => (
            <div className="account" onClick={() => checkAddress(index)}>
                <div className="icon"><AccountCircleIcon className="img"/></div>
                <div className="info">
                    <div className="name">Account{index}</div>
                    <div className="address">{obj.address}</div>
                </div>
                {caddress === obj.address ? <div className="icon2"><CheckCircleIcon className="img"/></div> : ""}
            </div>
        ))
    );
};  

export default Modalaccount;