import React from 'react';
import './styles/main.css';
import { WalletClient } from "../api/wallet";
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const Transcation = (props: any) => {
    const {pros_transcation, _index} = props;
    //console.log(pros_transcation)

    const moveToTabs = async(version:string,index:number)=>{
        chrome.tabs.create({url:"http://localhost:3000/txn/"+version});
    }

    return(
        pros_transcation.map((obj: any,index: any) => (
            <div className="transcation" key={index} onClick={() => moveToTabs(obj.version,_index)}>
                <div className="down">{obj.success ? <ArrowCircleUpIcon className="icon"/> : <HighlightOffIcon className="icon2"/>}</div>
                <div className="info">
                    <div className="tran_title">{obj.hash}</div>
                    <div className="tran_time">{obj.success ? "success": "fail"}</div>
                </div>
                <div className="inout">{obj.success ? WalletClient.getFormattedBalanceStr(obj.price) : 0}</div>
                <div className="type">APT</div>
                <div className="arrow"><ArrowForwardIosIcon className="icon"/></div>
            </div>
        ))
    );
};  

export default Transcation;