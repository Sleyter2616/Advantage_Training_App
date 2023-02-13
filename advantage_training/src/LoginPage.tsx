import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Typography, TextField, Button, Radio, FormControlLabel, RadioGroup } from '@material-ui/core';
import {useNavigate} from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(3),
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: theme.spacing(3, 0, 2),
  }
}));

const LoginPage = () => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formType, setFormType] = useState('login');
  const history = useNavigate();

  const handleSubmit = (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Simulate a successful login
    if (formType === 'login') {
      if (email === 'test@example.com' && password === 'password') {
        history('/home');
      } else {
        console.log('Login failed. Invalid username or password.');
      }
    } else {
      console.log(`Creating account with email: ${email}, password: ${password}`);
    }

  };




  return (
    <Container className={classes.root}>
      <Typography variant="h5">{formType === 'login' ? 'Login' : 'Create an Account'}</Typography>
      <RadioGroup className={classes.radioGroup} value={formType} onChange={(event) => setFormType(event.target.value)}>
        <FormControlLabel value="login" control={<Radio />} label="Login" />
        <FormControlLabel value="create" control={<Radio />} label="Create an Account" />
      </RadioGroup>
      <form className={classes.form} onSubmit={handleSubmit}>
        <TextField
          label="Email"
          variant="outlined"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          variant="outlined"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          fullWidth
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          {formType === 'login' ? 'Login' : 'Create an Account'}
        </Button>
      </form>
    </Container>
  );
};

export default LoginPage;
