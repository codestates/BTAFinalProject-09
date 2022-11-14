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
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Transcation from './transcation';
import Button from "@mui/material/Button";
import Modalaccount from './modalaccount';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


const Main = () => {
    const navigate = useNavigate();
    const [walletName, setWalletName] = useState("");
    const [address, setAddress] = useState("");
    const [addressList, setAddressList] = useState<object>([]);
    const [amount, setAmount] = useState(0);
    const [transcation, setTranscation] = useState<object>([]); //trans 
    const { index } = useContext(NetworkContext);
    const decimals = 10**8;

    const [open, setOpen] = useState(false);
    const [openToggle, setOpenToggle] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleToggleClose = () => {
        setOpenToggle(false);
    };
    const handleToggle = () => {
        setOpenToggle(!openToggle);
    };

    const style = {
        position: 'absolute' as 'absolute',
        top: '105%',
        left: '50%',
        transform: 'translate(-47%, -150%)',
        width: 250,
        height: 300,
        bgcolor: 'background.paper',
        border: '1px solid #000',
        boxShadow: 24,
        p: 4
    };
      

    useEffect(() => {
    
        // 니모닉에 해당하는 모든 계정 불러와서, 모달에 파싱, 사용중인 모델 체크 -> 다중생성 기능 한다음 ㄱ 
        // 계정 목록 동록 동기화 
        chrome.storage.local.get(["accountList"], (result) => {
            setAddressList(result["accountList"])
        });

        
        chrome.storage.local.get(["walletname"], (result) => {
            setWalletName(result["walletname"])
        });
        chrome.storage.local.get(["info"], (result) => {
            setAddress(result["info"][0].address)
            console.log(index)
            const walletClient = new WalletClient(common.GetNetWork(index), common.GetFaucetNetWork(index));
            try{
                walletClient.getBalance(result["info"][0].address).then((_balance)=>{
                    setAmount(_balance);
                    console.log(_balance)
                });
                // 트랜잭션
                walletClient.accountTransactions(result["info"][0].address).then((result) => {
                    setTranscation(result);
                });
            }catch(e){
                setAmount(0)
                console.log("11")
            }
        }); 
    }, []);

    useEffect(() => {
        const walletClient = new WalletClient(common.GetNetWork(index), common.GetFaucetNetWork(index));
        try{
            if(address === "")
                return;
            walletClient.getBalance(address).then((_balance)=>{
                setAmount(_balance);
                console.log(_balance)
            });
        }catch(e){
            setAmount(0)
            console.log("2")
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

    // 구매 버튼
    const buyButton = async()=>{
        chrome.tabs.create({url:"https://www.bithumb.com/react/"});
    }

    // 퍼셋 버튼 
    const faucetButton = async()=>{
        const faucetClient = new FaucetClient(common.GetNetWork(index), common.GetFaucetNetWork(index)); // <:!:section_1
        faucetClient.fundAccount(address,100_000_000).then(()=>{
            chrome.runtime.sendMessage('', {
                type: 'notification',
                options: {
                    title: 'Apcellent',
                    message: '1 Aptos received !!',
                    iconUrl: '/logo192.png',
                    type: 'basic'
                }
            });
            
        });
    }

    // get privatekey 
    const privatekeyButton = async()=>{
        chrome.storage.local.get(["info"], (result) => {
            console.log(result["info"][0].privateKey)
            navigator.clipboard.writeText(String(result["info"][0].privateKey)).then((r)=>{
                
            });
            chrome.runtime.sendMessage('', {
                type: 'notification',
                options: {
                    title: 'Apcellent',
                    message: 'Your PrivateKey has been copied !!',
                    iconUrl: '/logo192.png',
                    type: 'basic'
                }
            });
        });
    }

    //add account 
    const addAccountButton = async()=>{
        handleClose()
        handleToggle()
        let _key;
        const walletClient = new WalletClient(common.GetNetWork(index), common.GetFaucetNetWork(index));
        _key = await chrome.storage.local.get(["mnemonic"]);

        let tempAccount = await walletClient.createNewAccount(_key["mnemonic"]);
        console.log(tempAccount.address)
        walletClient.airdrop(tempAccount.address.toString(), 0).then((result) =>{

        })
        walletClient.importWallet(_key["mnemonic"]).then((_result =>{
            chrome.storage.local.set({"accountList": _result.accounts}).then(()=>{
                setAddressList(_result.accounts)
                chrome.runtime.sendMessage('', {
                    type: 'notification',
                    options: {
                        title: 'Apcellent',
                        message: 'New Account !!',
                        iconUrl: '/logo192.png',
                        type: 'basic'
                    }
                });
                handleToggleClose();
            });
        }))
   
    }

    return(
        <div className="container_main">
            <div className="con_info">
                <div className="walletname">{walletName}</div>
                <div className="account" onClick={handleOpen}> <MoreVertIcon onClick={handleOpen} className="icon"/></div>
                <div className="copy" onClick={copyEvent} > <ContentCopyIcon onClick={copyEvent} className="icon"/> </div>
                <div className="address">{address}</div>
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
                    <div className="balance">{amount/decimals}</div>

                    <div className="buy" onClick={buyButton}><StoreIcon className="icon"/></div>
                    <div className="buytext">Buy</div>
                    <div className="send" onClick={() => navigate("/sendtoken")}><ReplyIcon className="icon"/></div>
                    <div className="sendtext">Send</div>
                </div>
            </div>
            <Button 
                disabled={(index == 1 || index ==2 || index == 3) ? false : true }
                onClick={faucetButton}
                variant="contained" 
                className='addtoken' 
                size='small'
                fullWidth={true}>
                Faucet
            </Button>
            <div className="transcationname">RECENT TRANSCATION</div>
            <div className="con_transcation">
                {/* 트랜잭션 */}
                <Transcation pros_transcation={transcation}/>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <div className="container_modal">
                        <div className="title">Account</div>
                        <div className="container_account">
                            <Modalaccount pros_account={addressList}/>
                        </div>
                        <Button 
                            onClick={addAccountButton}
                            variant="contained" 
                            className='addtoken' 
                            size='small'
                            fullWidth={true}>
                            Add Account
                        </Button>

                        <Button 
                            onClick={privatekeyButton}
                            variant="contained" 
                            className='addtoken' 
                            size='small'
                            color="success"
                            style={{"marginTop":5}}
                            fullWidth={true}>
                            Private Key
                        </Button>
                    </div>
                
                </Box>
            </Modal>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 4 }}
                open={openToggle}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>

    );
};  

export default Main;