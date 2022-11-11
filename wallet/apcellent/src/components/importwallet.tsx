import { NODE_URL, FAUCET_URL} from "../common";
import { AptosClient, AptosAccount, CoinClient, FaucetClient, HexString } from "aptos";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/importwallet.css';
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import * as sha256 from "fast-sha256";


const ImportWallet = () => {

    const navigate = useNavigate();
    const [privatekey, setPrivatekey] = useState(""); //password 
    const [pwd, setPwd] = useState(""); //password 
    const [cpwd, setCPwd] = useState(""); //cpassword
    const [cpwdFlag, setCpwdFlag] = useState(false);
    const [privatedFlag, setPrivatedFlag] = useState(false);
    const [disabledFlag, setDisabledFlag] = useState(true);

    const handleChange_private = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPrivatekey(event.target.value);
        checkSubmit()
    };
    
    const handleChange_pwd = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPwd(event.target.value);
        checkSubmit()
    };

    const handleChange_cpwd = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCPwd(event.target.value)
        checkSubmit()
    };

    const checkSubmit = () =>{
        if(pwd === "" || cpwd === "" || privatekey === "" ){
            setDisabledFlag(true);
            return;
        }
        setDisabledFlag(false);
    }

    const submit = ()=> {
        if(pwd === "")
            setCpwdFlag(true);
        else
            pwd === cpwd ? setCpwdFlag(false) : setCpwdFlag(true);

        if(privatekey === "")
            setPrivatedFlag(true)

        //0xef3f052e2bfa798b9d6e58b9a98598031855c36c4cb482ed77f6016f66e6ee3e
        try{ 
            const privateKeyBytes = new HexString(privatekey).toUint8Array();
            const account = new AptosAccount(privateKeyBytes);
   
            let convert = new Uint8Array(Buffer.from(pwd,'base64')); // let str = Buffer.from(key.secretKey).toString('base64');
            const hash = HexString.fromUint8Array(sha256.hash(convert)).toString();
            chrome.storage.local.clear();
            chrome.storage.local.set({"walletname": "default"});
            chrome.storage.local.set({"lock": hash});
            chrome.storage.local.set({"info": account.toPrivateKeyObject()});
            navigate("/main");
        }catch(e){
            // 잘못된 private면 modal 
        }
        //console.log(HexString.fromUint8Array(sha256.hash(privateKeyBytes)).toString());
    }
    return(
        <div className="import">
            <div className="title">Import Wallet</div>
            <TextField 
                className='inputype1' 
                helperText={privatedFlag ? "Invalid PrivateKey": ""}
                error={privatedFlag}
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
                disabled={disabledFlag} 
                variant="contained" 
                className='button'
                size='small'
                fullWidth={true} 
                onClick={submit}>Submit</Button>
          
        </div>

    );
};  

export default ImportWallet;