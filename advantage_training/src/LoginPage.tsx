import React,{useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import * as Yup from 'yup';
import { Formik, Form,FormikHelpers } from 'formik';
import { Container, Typography, TextField, Button, Radio, FormControlLabel, RadioGroup } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc , getDoc, doc} from 'firebase/firestore';
import { db} from "./firebaseConfig";

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

export interface Trainer {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const classes = useStyles();
  const [formType, setFormType] = useState('login');
  const [status, setStatus] = useState('');

  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogin = (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(async () => {
        const userAuth = auth.currentUser;
        if (userAuth) {
          const userDoc = await getDoc(doc(db, 'users', userAuth.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const user = {
              email: userData.email,
              firstName: userData.firstName,
              lastName: userData.lastName,
              uid: userAuth.uid
            };
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userData', JSON.stringify(user));
            onLogin();
            navigate('/home');
          } else {
            console.log('User data not found');
            setStatus('User data not found');
          }
        } else {
          console.log('User not authenticated');
        }
      })
      .catch((error) => {
        console.log('Login failed. Error:', error.message);
        setStatus(`Failed to login, ${error.message}`);
      });
  };

  const handleCreateAccount = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        await setDoc(docRef, {
          email: email,
          firstName: firstName,
          lastName: lastName,
          uid: user.uid
        });
        console.log('Document written with ID: ', docRef.id);
        setStatus('Account created, You may now log in');
        setFormType('login')
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error('Error creating user: ', e);
        setStatus(`Failed to create Account, ${e.message}`);
      }
    }
  };


  const handleSubmit = (values: Trainer, formikHelpers: FormikHelpers<Trainer>) => {
    const { resetForm } = formikHelpers;
    if (formType === 'login') {
      handleLogin(values.email, values.password);
    } else {
      handleCreateAccount(values.email, values.password, values.firstName, values.lastName);
      resetForm();
    }
  };
  const createAccountValidationSchema = Yup.object({
    firstName: Yup.string()
      .matches(/^[a-zA-Z ]+$/, 'First name must only contain letters')
      .required('First name is required'),
    lastName: Yup.string()
      .matches(/^[a-zA-Z ]+$/, 'Last name must only contain letters')
      .required('Last name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character'
      ),
  });
  const loginValidationSchema = Yup.object({
    firstName: Yup.string()
      .matches(/^[a-zA-Z ]+$/, 'First name must only contain letters')
     ,
    lastName: Yup.string()
      .matches(/^[a-zA-Z ]+$/, 'Last name must only contain letters')
    ,
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character'
      ),
  });
  return (
    <Container className={classes.root}>
            <Typography variant="h3">Advantage Training</Typography>
      <Typography variant="h5">{formType === 'login' ? 'Login' : 'Create an Account'}</Typography>
      <RadioGroup className={classes.radioGroup} value={formType} onChange={(event) => setFormType(event.target.value)}>
        <FormControlLabel value="login" control={<Radio />} label="Login" />
        <FormControlLabel value="create" control={<Radio />} label="Create an Account" />
      </RadioGroup>
      {formType === 'login' ? (
      <Formik
      initialValues={{ firstName: '', lastName: '', email: '', password: '' }}
        validationSchema={loginValidationSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form className={classes.form}>
            <TextField
              label="Email"
              variant="outlined"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              fullWidth
              margin="normal"
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              label="Password"
              variant="outlined"
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              fullWidth
              margin="normal"
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <Button
              className={classes.submit}
              color="primary"
              variant="contained"
              fullWidth
              type="submit"
            >
              Login
            </Button>
            {status && <Typography color="error">{status}</Typography>}
          </Form>
        )}
      </Formik>):(
         <Formik
         initialValues={{ firstName: '', lastName: '', email: '', password: '' }}
         validationSchema={createAccountValidationSchema}
         onSubmit={handleSubmit}
       >
         {(formik) => (
           <Form className={classes.form}>
                 <TextField
                   label="First Name"
                   variant="outlined"
                   name="firstName"
                   value={formik.values.firstName}
                   onChange={formik.handleChange}
                   fullWidth
                   margin="normal"
                   error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                   helperText={formik.touched.firstName && formik.errors.firstName}
                 />
                 <TextField
                   label="Last Name"
                   variant="outlined"
                   name="lastName"
                   value={formik.values.lastName}
                   onChange={formik.handleChange}
                   fullWidth
                   margin="normal"
                   error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                   helperText={formik.touched.lastName && formik.errors.lastName}
                 />
             <TextField
               label="Email"
               variant="outlined"
               name="email"
               value={formik.values.email}
               onChange={formik.handleChange}
               fullWidth
               margin="normal"
               error={formik.touched.email && Boolean(formik.errors.email)}
               helperText={formik.touched.email && formik.errors.email}
             />
             <TextField
               label="Password"
               variant="outlined"
               name="password"
               type="password"
               value={formik.values.password}
               onChange={formik.handleChange}
               fullWidth
               margin="normal"
               error={formik.touched.password && Boolean(formik.errors.password)}
               helperText={formik.touched.password && formik.errors.password}
             />
             <Button
               className={classes.submit}
               color="primary"
               variant="contained"
               fullWidth
               type="submit"
             >
              Create an Account
             </Button>
             {status && <Typography color="error">{status}</Typography>}
           </Form>
         )}
       </Formik>
      )}
    </Container>
  );
};

export default LoginPage;
