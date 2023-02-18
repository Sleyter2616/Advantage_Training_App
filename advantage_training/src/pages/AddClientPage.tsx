import React, {useState} from 'react';
import {  doc, setDoc } from "firebase/firestore";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Client } from '../Client/types';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, Typography } from '@material-ui/core';
import { db } from '../firebaseConfig';
import Header from '../components/Header';
const useStyles = makeStyles({
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
  button: {
    marginTop: '1rem',
    background: '#3f51b5',
    color: '#fff',
    '&:hover': {
      background: '#303f9f',
    },
  },
});

interface AddClientPageProps {
  onAddClient: (client: Client) => void;
}

const AddClientPage: React.FC<AddClientPageProps> = ({ onAddClient }) => {
  const navigate = useNavigate();
  const classes = useStyles();

  const [values, setValues] = useState({
    id: uuidv4(),
    firstName:'',
    lastName: '',
    dob: '',
    height: '',
    weight: '',
    goals: '',
    clientNotes: '',
    programs:[]
  });

  const handleSubmit = async (values: Client) => {
    const newClientWithId = { ...values, id: uuidv4() };
    onAddClient(newClientWithId);
    await setDoc(doc(db, "clients", newClientWithId.id), newClientWithId);
    navigate(`/client/${newClientWithId.id}/add-program`);
  };
  const validationSchema = Yup.object({
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    dob: Yup.string().matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/, 'Must be in the format MM/DD/YYYY')
    .required('Required'),
    height: Yup.string()
      .matches(/^[1-9][0-9]*$/, 'Must be a valid number of inches')
      .required('Required'),
    weight: Yup.string()
      .required('Required')
      .matches(/^\d+(\.\d{1,2})?$/, 'Must be a valid weight in pounds'),
    goals: Yup.string().required('Required'),
    clientNotes: Yup.string().notRequired(),
    programs:Yup.array()
  });

  return (
    <div>
      <Header/>
      <Typography variant="h4" component="h1" align="center">Add New Client</Typography>
      <Formik
        initialValues={values}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleBlur, errors, touched }) => (
          <Form className={classes.form}>
            <TextField
              className={classes.textField}
              id="firstName"
              label="First Name (Required)"
              name="firstName"
              value={values.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.firstName && Boolean(errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />
             <TextField
              className={classes.textField}
              id="lastName"
              label="Last Name (Required)"
              name="lastName"
              value={values.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.lastName && Boolean(errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            />
            <TextField
              className={classes.textField}
              id="dob"
              label="Date of Birth (Required)"
              name="dob"
              value={values.dob}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.dob && Boolean(errors.dob)}
              helperText={touched.dob && errors.dob}
            />
            <TextField
              className={classes.textField}
              id="height"
              label="Height (in) (Required)"
              name="height"
              type="text"
              value={values.height}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.height && Boolean(errors.height)}
              helperText={touched.height && errors.height}
            />
            <TextField
              className={classes.textField}
              id="weight"
              label="Weight (lbs) (Required)"
              name="weight"
              type="text"
              value={values.weight}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.weight && Boolean(errors.weight)}
              helperText={touched.weight && errors.weight}
            />
            <TextField
              className={classes.textField}
              id="goals"
              label="Goals (Required)"
              name="goals"
              value={values.goals}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.goals && Boolean(errors.goals)}
              helperText={touched.goals && errors.goals}
            />
            <TextField
              className={classes.textField}
              id="clientNotes"
              label="Client Notes (Optional)"
              name="clientNotes"
              value={values.clientNotes}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.clientNotes && Boolean(errors.clientNotes)}
              helperText={touched.clientNotes && errors.clientNotes}
            />
      <Button className={classes.button} type="submit" variant="contained">
        Add Client and Create Programs
      </Button>
    </Form>
  )}
</Formik>
</div>
);
              }
export default AddClientPage;