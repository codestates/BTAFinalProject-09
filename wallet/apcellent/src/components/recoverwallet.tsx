import { NODE_URL, FAUCET_URL} from "../common";
import { AptosClient, AptosAccount, CoinClient, FaucetClient } from "aptos";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import StoreIcon from '@mui/icons-material/Store';
import ReplyIcon from '@mui/icons-material/Reply';
import './styles/recoverwallet.css';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";


const RecoverWallet = () => {
    const [mnemonic, setMnemonic] = useState(""); 
    const [checked, setChecked] = useState(false);
    const [cpwdFlag, setCpwdFlag] = useState(false);
    const [name, setName] = useState(""); //name
    const [pwd, setPwd] = useState(""); //password 
    const [cpwd, setCPwd] = useState(""); //cpassword
    const navigate = useNavigate();

    const handleChange_name = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    };

    const handleChange_pwd = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPwd(event.target.value);
    };

    const handleChange_cpwd = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCPwd(event.target.value)
    };

  const submit = async() =>{
 
  }
    
    return(
        <div className="recover">
            <div className='title'>Recover Wallet</div>
                <TextField className='input_type' onChange={handleChange_name} focused={true} size='small' id="outlined-basic" label="Wallet name" variant="outlined" />
                <TextField className='input_type' onChange={handleChange_pwd} type={"password"} focused={true} size='small' style={{"top":220}} id="outlined-basic" label="Password" variant="outlined" />
                <TextField className='input_type' 
                    error={cpwdFlag} 
                    helperText={cpwdFlag ? "Password doesn't match" :""}
                    onChange={handleChange_cpwd} 
                    type={"password"} 
                    focused={true} 
                    size='small' 
                    style={{"top":285}} 
                    id="outlined-basic" 
                    label="Comfirm password" 
                    variant="outlined" />
                <TextField className='input_type'  
                    size='small' 
                    style={{"top":350}} 
                    id="outlined-basic" 
                    label="Mnemonic" 
                    variant="outlined" 
                    multiline={true}
                    rows={3}
                    focused={true}/>
                <Button disabled={!checked} 
                    variant="contained" 
                    className='button'
                    size='small' 
                    fullWidth={true} 
                    onClick={submit}>Submit
                </Button>
        </div>
    );
};  

export default RecoverWallet;