import React, { useContext, useState } from 'react';
import SettingsSharpIcon from '@mui/icons-material/SettingsSharp';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { SxProps } from '@mui/system';
import FormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel';
import RadioGroup, { useRadioGroup } from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { NetworkContext } from '../context';
import './styles/header.css';

const Header = () => {
    interface StyledFormControlLabelProps extends FormControlLabelProps {
        checked: boolean;
    }
     
    const [open, setOpen] = useState(false);
    const { _setIndex,index } = useContext(NetworkContext);
    const [networkName, setnetworkName] = useState("Local Network");
  
    const handleClick = () => {
      setOpen((prev) => !prev);
    };
  
    const handleClickAway = () => {
      setOpen(false);
    };
  
    const styles: SxProps = {
      position: 'absolute',
      top: 52,
      width:180,
      height:170,
      right: 15,
      zIndex: 4,
      border: '1px solid',
      borderRadius:'10px',
      bgcolor: 'background.paper',
    };

    const StyledFormControlLabel = styled((props: StyledFormControlLabelProps) => (
        <FormControlLabel {...props} />
      ))(({ theme, checked }) => ({
        '.MuiFormControlLabel-label': checked && {
          color: "blue",
        },
    }));

    const disconnect = () => {
      chrome.storage.local.clear();
      window.location.href = '/index.html';
    }
    //네트워크 전환
    const radioEvent = (type:number) => {
      _setIndex(type)
      if(type ===1)
        setnetworkName("DevNet");
      if(type ===2)
        setnetworkName("TestNet");
      if(type ===3)
        setnetworkName("LocalNet");
      //window.location.reload();
    }
   
    function MyFormControlLabel(props: FormControlLabelProps) {
        const radioGroup = useRadioGroup();
      
        let checked = false;
      
        if (radioGroup) {
          checked = radioGroup.value === props.value;
        }
      
        return <StyledFormControlLabel checked={checked} {...props} />;
    }

    return (
        <ClickAwayListener
        mouseEvent="onMouseDown"
        touchEvent="onTouchStart"
        onClickAway={handleClickAway}>
        <div className='container'>
            <div className='container_left'>
               <div className='mainicon'></div> 
            </div>
            <div className='container_right'>
              <div className='network'>{networkName}</div>
              <SettingsSharpIcon className='setting' color='primary' onClick={handleClick}/>
            </div>
            <Box sx={{ position: 'relative' }}>
                {   
                    open ? (<Box sx={styles}>
                        <div className='title2' style={{"textAlign":"center"}}>Network</div> 
                        <RadioGroup name="use-radio-group" defaultValue="first" sx={{"margin-left":15}}>
                            <MyFormControlLabel 
                              value="1" 
                              style={{"textAlign":"center"}} 
                              label={<Typography color="#054BB3">Dev Network</Typography>}
                              control={<Radio size='small' onClick={() => radioEvent(1)}/>}/>
                            <MyFormControlLabel 
                              value="2" 
                              style={{"textAlign":"center"}} 
                              label={<Typography color="#054BB3">Test Network</Typography>}
                              control={<Radio size='small' onClick={() => radioEvent(2)}/>}/>
                            <MyFormControlLabel 
                              value="3" 
                              style={{"textAlign":"center"}} 
                              label={<Typography color="#054BB3">Local Network</Typography>}
                              control={<Radio size='small' onClick={() => radioEvent(3)}/>}/>
                        </RadioGroup>
                          <Button color='error' onClick={disconnect} className='button'>DISCONNECT</Button>
                    </Box>) : null
                }
            </Box> 
        </div>
        </ClickAwayListener>
      );

}
export default Header;