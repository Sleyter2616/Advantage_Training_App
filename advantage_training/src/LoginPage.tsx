import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Typography, TextField, Button, Radio, FormControlLabel, RadioGroup } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

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
  const [result, setResult] = useState('');
  const history = useNavigate();

  const auth = getAuth();

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        history('/home');
      })
      .catch((error) => {
        console.log('Login failed. Error:', error.message);
        setResult(`Failed to login, ${error.message}`)
      });
  };

  const handleCreateAccount = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log(`Account created with email: ${email}, password: ${password}`);
        setResult('Account created, You may now log in')
      })
      .catch((error) => {
        console.log('Account creation failed. Error:', error.message);
        setResult(`Failed to create Account, ${error.message}`)
      });
  };

  const handleSubmit = (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formType === 'login') {
      handleLogin();
    } else {
      handleCreateAccount();
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
      <Typography>{result}</Typography>
    </Container>
  );
};

export default LoginPage;
