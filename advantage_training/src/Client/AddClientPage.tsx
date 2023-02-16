import React, {useState} from 'react';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Client, Movement } from './types';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, Typography, Grid } from '@material-ui/core';

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
    name: '',
    dob: '',
    height: '',
    weight: '',
    goals: '',
    notes: '',
  });

  const handleSubmit = (values: Client) => {
    const newClientWithId = { ...values, id: uuidv4() };
    onAddClient(newClientWithId);
    navigate(`/clients/${newClientWithId.id}`);
  };
  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    dob: Yup.string().matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/, 'Must be in the format MM/DD/YYYY'),
    height: Yup.string()
      .matches(/^[1-9][0-9]*$/, 'Must be a valid number of inches')
      .required('Required'),
    weight: Yup.string()
      .required('Required')
      .matches(/^\d+(\.\d{1,2})?$/, 'Must be a valid weight in pounds'),
    goals: Yup.string().required('Required'),
    notes: Yup.string().notRequired(),

  });

  return (
    <div>
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
              id="name"
              label="Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
            />
            <TextField
              className={classes.textField}
              id="dob"
              label="Date of Birth"
              name="dob"
              value={values.dob}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <TextField
              className={classes.textField}
              id="height"
              label="Height (in)"
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
              label="Weight (lbs)"
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
              label="Goals"
              name="goals"
              value={values.goals}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.goals && Boolean(errors.goals)}
              helperText={touched.goals && errors.goals}
            />
            <TextField
              className={classes.textField}
              id="notes"
              label="Notes"
              name="notes"
              value={values.notes}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.notes && Boolean(errors.notes)}
              helperText={touched.notes && errors.notes}
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