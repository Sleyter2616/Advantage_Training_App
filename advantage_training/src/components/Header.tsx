import React from 'react';
import { getAuth, signOut } from "firebase/auth";
import { useNavigate, } from 'react-router-dom';
import {  Button,  } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
  },
  textField: {
    width: '100%',
    marginBottom: '1rem',
  },
  logout: {
    margin: '1rem',
  },
  button: {
    margin: '1rem',
    background: '#3f51b5',
    color: '#fff',
    '&:hover': {
      background: '#303f9f',
    },
  },
}));



const Header: React.FC = ()=> {
    const auth = getAuth()
    const classes = useStyles()
    const navigate = useNavigate();
    return(
<div style={{ display: 'flex', justifyContent: 'space-between' }}>
<Button
  className={classes.button}
  onClick={() => {
    navigate('/home');
  }}
>
  Home
</Button>
<Button
  variant="contained"
  color="secondary"
  className={classes.logout}
  onClick={() => signOut(auth)}
>
  Sign Out
</Button>
</div>
    )
}
export default Header