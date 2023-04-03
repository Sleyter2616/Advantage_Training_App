import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Member } from '../../types';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, Typography } from '@material-ui/core';
import { db } from '../../firebaseConfig';
import Header from '../../components/Header';
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

interface AddMemberPageProps {
  onAddMember: (member: Member) => void;
}

const AddMemberPage: React.FC<AddMemberPageProps> = ({ onAddMember }) => {
  const navigate = useNavigate();
  const classes = useStyles();

  const [values, setValues] = useState({
    id: uuidv4(),
    firstName: '',
    lastName: '',
    dob: undefined,
    height: undefined,
    weight: undefined,
    goals: '',
    memberNotes: '',
    movementsScreen: [],
    history: [],
  });

  const handleSubmit = async (values: Member) => {
    const newMemberWithId = { ...values, id: uuidv4() };
    onAddMember(newMemberWithId);
    await setDoc(doc(db, 'members', newMemberWithId.id), newMemberWithId);
    navigate(`/member/${newMemberWithId.id}/add-movement-screen`);
  };
  const validationSchema = Yup.object({
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    dob: Yup.date().required('Required'),
    height: Yup.number().required('Required'),
    weight: Yup.number().required('Required'),
    goals: Yup.string().required('Required'),
    memberNotes: Yup.string().notRequired(),
    movementsScreen: Yup.array(),
    history: Yup.array(),
  });

  return (
    <div>
      <Header />
      <Typography variant="h4" component="h1" align="center">
        Add New Member
      </Typography>
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
              type="date"
              value={values.dob}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.dob && Boolean(errors.dob)}
              helperText={touched.dob && errors.dob}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              className={classes.textField}
              id="height"
              label="Height (inches) (Required)"
              name="height"
              type="number"
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
              type="number"
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
              id="memberNotes"
              label="Member Notes (Optional)"
              name="memberNotes"
              value={values.memberNotes}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.memberNotes && Boolean(errors.memberNotes)}
              helperText={touched.memberNotes && errors.memberNotes}
            />
            <Button
              className={classes.button}
              type="submit"
              variant="contained"
            >
              Add member and Add Movement Screen
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default AddMemberPage;
