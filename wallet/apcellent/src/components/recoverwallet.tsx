import common from "../common";
import { AptosClient, AptosAccount, CoinClient, FaucetClient, HexString } from "aptos";
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/recoverwallet.css';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import * as sha256 from "fast-sha256";
import { NetworkContext } from '../context';
import { WalletClient } from "../api/wallet";


const RecoverWallet = () => {
    const [mnemonic, setMnemonic] = useState(""); 
    const [cpwdFlag, setCpwdFlag] = useState(false);
    const [name, setName] = useState(""); //name
    const [pwd, setPwd] = useState(""); //password 
    const [cpwd, setCPwd] = useState(""); //cpassword
    const [disabledFlag, setDisabledFlag] = useState(true);
    const { index } = useContext(NetworkContext);
    const navigate = useNavigate();

    const handleChange_name = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
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

    const handleChange_mnemonic = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMnemonic(event.target.value)
        checkSubmit()
    };


    const checkSubmit = () =>{
        if(pwd === "" || cpwd === "" || name === "" || mnemonic === ""){
            setDisabledFlag(true);
            return;
        }
        setDisabledFlag(false);
    }

    const submit = async() =>{
        if(pwd === "")
          setCpwdFlag(true);
        else
          pwd === cpwd ? setCpwdFlag(false) : setCpwdFlag(true);
        
        //hill alpha table bubble false business across note illegal point will govern
        if(name === "")
            setName("default")
            try{ 
                let convert = new Uint8Array(Buffer.from(pwd,'base64')); // let str = Buffer.from(key.secretKey).toString('base64');
                const hash = HexString.fromUint8Array(sha256.hash(convert)).toString();
                chrome.storage.local.clear();
                await chrome.storage.local.set({"walletname": name});
                await chrome.storage.local.set({"lock": hash});
            

                const walletClient = new WalletClient(common.GetNetWork(index), common.GetFaucetNetWork(index));
                const result = await walletClient.importWallet(mnemonic);
                await chrome.storage.local.set({"mnemonic": mnemonic});
                await chrome.storage.local.set({"info": new Array(result.accounts[0])});
               
                let arr = new Array()
                for(let i=0;i<result.accounts.length;i++){
                    arr.push(result.accounts[i]);
                }
                console.log(arr)
                await chrome.storage.local.set({"accountList": arr}) 
                
                console.log(result)
                navigate("/main")
                // const account =  AptosAccount.fromDerivePath("m/44'/637'/0'/0'/0'",mnemonic);
                // chrome.storage.local.set({"info": account.toPrivateKeyObject()});
                
            }catch(e){
                //error 처리 해야함 니모닉 
            }
            //console.log(account.toPrivateKeyObject());
          // chrome.storage.local.get(["lock"], (result) => {
          //   console.log(result["lock"])
          // });
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
                    onChange={handleChange_mnemonic} 
                    variant="outlined" 
                    multiline={true}
                    rows={3}
                    focused={true}/>
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

export default RecoverWallet;