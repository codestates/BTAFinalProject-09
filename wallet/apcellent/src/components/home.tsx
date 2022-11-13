import common from "../common";
import { AptosClient, AptosAccount, CoinClient, FaucetClient, HexString } from "aptos";
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { createTheme,ThemeProvider } from "@mui/material/styles";
import './styles/home.css';
import * as sha256 from "fast-sha256";

const Home = () => {
  const navigate = useNavigate();
  const bip39 = require('bip39');

  useEffect(() => {
    chrome.storage.local.get(["lock"], (result) => {
      if(result["lock"] !== undefined){
        navigate("/standby")
      }
    }); 
    test()
    // chrome.alarms.onAlarm.addListener((alarm) => {
    //   console.log(alarm.name); // refresh
    //   helloWorld();
    });

  // chrome.runtime.onInstalled.addListener(() => {
  //   console.log('onInstalled...');
  //   chrome.alarms.create('refresh', { periodInMinutes: 1 });
  // });

  // function helloWorld() {
  //   console.log("Hello, world!");
  // }

  const test = async () =>{
    //const client = new AptosClient(NODE_URL);
    //const faucetClient = new FaucetClient(NODE_URL, FAUCET_URL); // <:!:section_1

    // let mnemonic: string = getMnemonic(language.english,12);
    // const seed: Buffer = toSeed(mnemonic);
    // const seedHex: string = toSeedHex(mnemonic);
    // let mnemonic: string = bip39.generateMnemonic();
    // console.log(bip39.generateMnemonic())

    // const data = await client.getAccountTransactions("0x63dcd7f39036f3a93547f71f79da504e03486003bdbf9c5278065763bad8d335");
    // console.log(data);

    //비밀번호 hasing
    //const msg = "aaaaaa";
    //const convert = new HexString(msg).toUint8Array();
    //console.log(HexString.fromUint8Array(sha256.hash(convert)).toString());
  
  
    //console.log(seedHex)
    //mnemonic = "win unfold project have wild train undo kitten torch distance tongue scan";
    //const coinClient = new CoinClient(client); // <:!:section_1a
    

    //나모닉으로 계정 생성 또는 복구 
    //const a1 =  AptosAccount.fromDerivePath("m/44'/637'/0'/0'/0'",mnemonic);

    //console.log("private -> "+a1.authKey() +"|| "+a1.pubKey() + "||"+a1.address() )
    //console.log(a1.toPrivateKeyObject());
    //await faucetClient.fundAccount(a1.authKey(),1000000000);
    
    // private key로 복구 
    //const privateKeyBytes = new HexString("0xef3f052e2bfa798b9d6e58b9a98598031855c36c4cb482ed77f6016f66e6ee3e").toUint8Array();
    //const a3 = new AptosAccount(privateKeyBytes);
    //console.log(HexString.fromUint8Array(sha256.hash(privateKeyBytes)).toString());
    

    // set storage 
    //chrome.storage.local.set({"key": "value"});
    // get storage 
    // chrome.storage.local.get(["lock"], (result) => {
    //   console.log(result["lock"])
    // });
  }
  const theme = createTheme({
    palette:{
      primary:{
        main:"#054BB3"
      }
    }
  });

  const move = async(flag: number) =>{
    if(flag == 1){
      navigate('/newwallet')
    }
    if(flag == 2){
      navigate('/recoverwallet')
    }
    if(flag == 3){
      navigate('/importwallet')
    }
  }

  return (
    <div className="home">
      <div className="title">Apcellent Wallet</div>
      <div className="line"/>
      <div className="menu1" onClick={() => move(1)}>
        <div className="image"/> 
        <div className="title">New Wallet</div>
        <div className="arrow"/>
      </div>
      <div className="line" style={{"top":220}}/>
      <div className="menu2" onClick={() => move(2)}>
        <div className="image"/> 
        <div className="title">Recover Wallet</div>
        <div className="arrow"/>
      </div>
      <div className="line" style={{"top":271}}/>
      <div className="menu3" onClick={() => move(3)}>
        <div className="image"/> 
        <div className="title">Import Wallet</div>
        <div className="arrow"/>
      </div>
      <div className="line" style={{"top":321}}/>
    </div>
  );
};

export default Home;

