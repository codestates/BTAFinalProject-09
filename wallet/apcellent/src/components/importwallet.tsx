import { NODE_URL, FAUCET_URL} from "../common";
import { AptosClient, AptosAccount, CoinClient, FaucetClient } from "aptos";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import StoreIcon from '@mui/icons-material/Store';
import ReplyIcon from '@mui/icons-material/Reply';
import './styles/importwallet.css';
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";


const ImportWallet = () => {

    const [privatekey, setPrivatekey] = useState(""); //password 
    const [pwd, setPwd] = useState(""); //password 
    const [cpwd, setCPwd] = useState(""); //cpassword
    const [cpwdFlag, setCpwdFlag] = useState(false);

    const handleChange_private = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPrivatekey(event.target.value);
    };
    
    const handleChange_pwd = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPwd(event.target.value);
    };

    const handleChange_cpwd = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCPwd(event.target.value)
    };

    const a = ()=>{

    }
    return(
        <div className="import">
            <div className="title">Import Wallet</div>
            <TextField 
                className='inputype1' 
                onChange={handleChange_private} 
                focused={true} size='small' 
                id="outlined-basic" 
                label="Private Key" 
                variant="outlined"
                multiline={true}
                rows={3} />

            <TextField 
                className='inputype2' 
                onChange={handleChange_pwd} 
                focused={true} size='small' 
                id="outlined-basic" 
                label="Password" 
                type={"password"}
                variant="outlined"/>

            <TextField className='inputype3' 
                error={cpwdFlag} 
                helperText={cpwdFlag ? "Password doesn't match" :""}
                onChange={handleChange_cpwd} 
                type={"password"} 
                focused={true} size='small' 
                id="outlined-basic" 
                label="Comfirm password" 
                variant="outlined" />

             <Button 
                disabled={true} 
                variant="contained" 
                className='button'
                size='small'
                fullWidth={true} 
                onClick={a}>Submit
            </Button>
          
        </div>

    );
};  

export default ImportWallet;