import { NODE_URL, FAUCET_URL} from "../common";
import { AptosClient, AptosAccount, CoinClient, FaucetClient, HexString } from "aptos";
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import * as sha256 from "fast-sha256";
import './styles/standby.css';


const Standby = () => {
    const navigate = useNavigate();
    const [pwd, setPwd] = useState('');
    const [flag, setFlag] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPwd(event.target.value);
    };

    const unlock = async () => {
         chrome.storage.local.get(["lock"], (result) => {
            const original = result["lock"] 
            let convert = new Uint8Array(Buffer.from(pwd,'base64')); // let str = Buffer.from(key.secretKey).toString('base64');
            const hash = HexString.fromUint8Array(sha256.hash(convert)).toString();

            if(original === hash){
                navigate('/main');
            }else{
                setFlag(true);
            }
        }); 
    }



    return(
        <div className="standby">
            <div className="title1">Welcome back!</div>
            <div className="title2">Decentralized apps are waiting for</div>
            <TextField 
                focused={true} 
                error={flag} 
                helperText={flag ? "Password doesn't match" :""}
                className='input'
                onChange={handleChange} 
                type="password" 
                size='small' 
                style={{"top":220}} 
                id="outlined-basic" 
                label="Password" 
                variant="outlined" />
            <Button variant="contained" onClick={unlock} className='button' size='small' fullWidth={true} >Unlock</Button>
        </div>

    );
};  

export default Standby;