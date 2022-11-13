import common from "../common";
import { AptosClient, AptosAccount, CoinClient, FaucetClient } from "aptos";
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import StoreIcon from '@mui/icons-material/Store';
import ReplyIcon from '@mui/icons-material/Reply';
import './styles/main.css';
import { NetworkContext } from "../context";
import { WalletClient } from "../api/wallet";


const Main = () => {
    const navigate = useNavigate();
    const [walletName, setWalletName] = useState("");
    const [address, setAddress] = useState("");
    const [amount, setAmount] = useState(0);
    const { index } = useContext(NetworkContext);
    const decimals = 10**8;

    useEffect(() => {
        chrome.storage.local.get(["walletname"], (result) => {
            setWalletName(result["walletname"])
        });
        chrome.storage.local.get(["info"], (result) => {
            setAddress(result["info"].address)
            const walletClient = new WalletClient(common.GetNetWork(index), common.GetFaucetNetWork(index));
            try{
                walletClient.getBalance(result["info"].address).then((_balance)=>{
                    setAmount(_balance);
                });
            }catch(e){
                setAmount(0)
            }
        }); 
    }, []);

    useEffect(() => {
        const walletClient = new WalletClient(common.GetNetWork(index), common.GetFaucetNetWork(index));
        try{
            walletClient.getBalance(address).then((_balance)=>{
                setAmount(_balance);
            });
        }catch(e){
            setAmount(0)
        }
    }, [index]);

    const copyEvent = async() => {

        await navigator.clipboard.writeText(address);
        chrome.runtime.sendMessage('', {
            type: 'notification',
            options: {
                title: 'Apcellent',
                message: 'Your address has been copied !!',
                iconUrl: '/logo192.png',
                type: 'basic'
            }
        });
    }

    // apotos coin 정보 get
    // const getBalance = async (address:string) => {
    //     const client = new AptosClient(common.GetNetWork(index));
    //     let balance = 0;
    //     const resources: any = await client.getAccountResources(address);
    
    //     Object.values(resources).forEach((value: any) => {
    //         if (value.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>") {
    //             balance = Number(value.data.coin.value);
    //         }
    //     });
    //     setAmount(balance);
    //     console.log(balance);
    // }

    // 구매 버튼
    const buyButton = async()=>{
        chrome.tabs.create({url:"https://www.bithumb.com/react/"});
    }

    return(
        <div className="main">
            <div className="userinfo">
                <div className="walletname">{walletName}</div>
                <div className="address">{address}</div>
                <ContentCopyIcon  onClick={copyEvent}  className="copy"/>
            </div>
            <div className="tokeninfo">
                <div className="img"></div>
                <div className="symbol">APT</div>
                <div className="name">Aptos</div>
                <div className="amount">{amount/decimals}</div>
                <StoreIcon className="buyicon" onClick={buyButton}/>
                <div className="buy" onClick={buyButton}>Buy</div>
                <ReplyIcon className="sendicon" onClick={() => navigate("/sendtoken")}/>
                <div className="send" onClick={() => navigate("/sendtoken")}>Send</div>
            </div>
            <div className="addtoken">
                Add tokens
            </div>
        </div>

    );
};  

export default Main;