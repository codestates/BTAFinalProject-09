import common from "../common";
import { AptosClient, AptosAccount, CoinClient, FaucetClient } from "aptos";
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import StoreIcon from '@mui/icons-material/Store';
import ReplyIcon from '@mui/icons-material/Reply';
import { NetworkContext } from "../context";
import { WalletClient } from "../api/wallet";

import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import MoreVertIcon from '@mui/icons-material/MoreVert';




const Test = () => {

    return(
        <div className="container_main">
            <div className="con_info">
                <div className="walletname">Wallet name !!</div>
                <div className="account"> <MoreVertIcon className="icon"/></div>
                <div className="copy"> <ContentCopyIcon className="icon"/> </div>
                <div className="address">0xec5880a92b865403bc8c126a2cd5dbfed44b5ad11d1909a865c4b03820155aee</div>
            </div>
           
            <div className="container_token_back">
                 {/*이게 토큰 하나*/}
                <div className="con_tokeninfo">
                    <div className="con">
                        <div className="img"/>
                        <div className="right">
                            <div className="symbol">APT</div>
                            <div className="name">Aptos</div>
                        </div>
                    </div>
                    <div className="balance">100.00000000</div>

                    <div className="buy"><StoreIcon className="icon"/></div>
                    <div className="buytext">Buy</div>
                    <div className="send"><ReplyIcon className="icon"/></div>
                    <div className="sendtext">Send</div>
                </div>
            </div>
            <div className="addtoken" style={{"display":"revert"}}>Add Tokens</div>
            <div className="transcationname">RECENT TRANSCATION</div>
            <div className="con_transcation">
                {/* 트랜잭션 */}
                <div className="transcation">
                    <div className="down"><ArrowCircleDownIcon className="icon"/></div>
                    <div className="info">
                        <div className="tran_title">0xec5880a92b865403bc8c126a2cd5dbfed44b5ad11d1909a865c4b03820155aee</div>
                        <div className="tran_time">2022-11-11 18:16:30</div>
                    </div>
                    <div className="inout">+1 APT</div>
                    <div className="arrow"><ArrowForwardIosIcon className="icon"/></div>
                </div>
                
            </div>
        </div>

    );
};  

export default Test;