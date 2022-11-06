import { NODE_URL, FAUCET_URL} from "../common";
import { AptosClient, AptosAccount, CoinClient, FaucetClient } from "aptos";
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { createTheme,ThemeProvider } from "@mui/material/styles";
import './styles/home.css';


const Home = () => {
  const navigate = useNavigate();
  
  const test = async () =>{
    const client = new AptosClient(NODE_URL);
    const faucetClient = new FaucetClient(NODE_URL, FAUCET_URL); // <:!:section_1

    // Create client for working with the coin module.
    // :!:>section_1a
    const coinClient = new CoinClient(client); // <:!:section_1a

    // Create accounts.
    // :!:>section_2
    const alice = new AptosAccount();
    const bob = new AptosAccount(); // <:!:section_2

    // Print out account addresses.
    console.log("=== Addresses ===");
    console.log(`Alice: ${alice.address()}`);
    console.log(`Bob: ${bob.address()}`);
    console.log("");
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
  }

  return (
    <div className="home">
      <div className="title">Apcellent Wallet</div>
      <div className="line"/>
      <div className="menu1" onClick={() => move(1)} >
        <div className="image"/> 
        <div className="title">New Wallet</div>
        <div className="arrow"/>
      </div>
      <div className="line" style={{"top":220}}/>
      <div className="menu2">
        <div className="image"/> 
        <div className="title">Recover Wallet</div>
        <div className="arrow"/>
      </div>
      <div className="line" style={{"top":271}}/>
      <div className="menu3">
        <div className="image"/> 
        <div className="title">Import Wallet</div>
        <div className="arrow"/>
      </div>
      <div className="line" style={{"top":321}}/>
    </div>
  );
};

export default Home;

