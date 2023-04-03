import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MovementScreen, Member } from '../../types';
import { Formik, Form, FieldArray } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { membersRef } from '../../firebaseConfig';
import {
  doc,
  onSnapshot,
  DocumentReference,
  updateDoc,
} from 'firebase/firestore';
import Header from '../../components/Header';

const defaultMovements: MovementScreen[] = [
  { id: uuidv4(), movementName: 'Squat', movementLevel: 'Yellow' },
  { id: uuidv4(), movementName: 'Hinge', movementLevel: 'Yellow' },
  { id: uuidv4(), movementName: 'Shoulder', movementLevel: 'Yellow' },
  { id: uuidv4(), movementName: 'Core', movementLevel: 'Yellow' },
  { id: uuidv4(), movementName: 'Push up', movementLevel: 'Yellow' },
  { id: uuidv4(), movementName: 'Conditioning', movementLevel: 'Yellow' },
];

const useStyles = makeStyles(() => ({
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
  textArea: {
    width: '100%',
    minHeight: '4rem',
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

const AddMovementScreenPage: React.FC = () => {
  const navigate = useNavigate();
  const [member, setMember] = useState<Member | null>(null);
  const classes = useStyles();
  const { id } = useParams();
  const memberRef: DocumentReference = doc(membersRef, id);
  const [values, setValues] = useState(
    defaultMovements.map((movement) => ({
      id: movement.id,
      movementName: movement.movementName,
      movementLevel: movement.movementLevel,
    }))
  );

  useEffect(() => {
    console.log(member, 'member');
    console.log('Fetching member with ID', id);
    console.log(values);
    const unsubscribe = onSnapshot(memberRef, (doc) => {
      setMember(doc.data() as Member);
    });
    return () => {
      unsubscribe();
    };
  }, [id]);

  const handleSubmit = async (values: MovementScreen[]) => {
    const newScreenWithId = [...values];
    console.log('member', member);
    if (member) {
      try {
        await updateDoc(memberRef, { movementsScreen: newScreenWithId });
        console.log('member programs updated successfully');
        navigate(`/home`);
      } catch (error) {
        console.error('Error updating member programs:', error);
      }
    }
  };

  // const handleAddMovement = () => {
  //   setValues([
  //     ...values,
  //     {
  //       id: uuidv4(),
  //       movementName: '',
  //       movementLevel: 'Yellow',
  //     },
  //   ]);
  //   console.log(values);
  // };

  // const handleRemoveMovement = (index: number) => {
  //   setValues((prevValues) => prevValues.filter((value, i) => i !== index));
  //   console.log(values);
  // };
  // const handleTextFieldChange = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   index: number
  // ) => {
  //   const { name, value } = e.target;
  //   setValues((prevMovements) => {
  //     const updatedMovements = prevMovements.map((movement, i) => {
  //       if (i === index && name === `movements.${index}.movementName`) {
  //         return { ...movement, movementName: value };
  //       }
  //       return movement;
  //     });
  //     console.log('Updated movements:', updatedMovements[index]);
  //     return updatedMovements;
  //   });
  // };

  const validationSchema = Yup.array().of(
    Yup.object().shape({
      id: Yup.string().required('Required'),
      movementName: Yup.string().required('Required'),
      movementLevel: Yup.string()
        .oneOf(['Green', 'Yellow', 'Red'], 'Invalid movement level')
        .required('Required'),
    })
  );

  return (
    <div>
      <Header />
      <Typography variant="h3" align="center">
        Add New Movement Screen
      </Typography>
      <Typography variant="h4" align="center">
        {member ? `member: ${member.firstName} ${member.lastName}` : ''}
      </Typography>
      <Formik
        initialValues={values}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleBlur, errors, touched, setValues }) => (
          <Form className={classes.form}>
            <Typography variant="h5" align="center">
              Movement Screen Details
            </Typography>
            <FieldArray name="movements">
              {() => (
                <div>
                  {values.map((value, index) => (
                    <div key={value.id}>
                      <TextField
                        className={classes.textField}
                        id={`movements.${index}.movementName`}
                        label="Movement Name (Required)"
                        name={`movements.${index}.movementName`}
                        value={value.movementName}
                        onChange={(e) => {
                          const { value } = e.target;
                          setValues((prevMovements) => {
                            const updatedMovements = prevMovements.map(
                              (movement, i) => {
                                if (i === index) {
                                  return { ...movement, movementName: value };
                                }
                                return movement;
                              }
                            );
                            return updatedMovements;
                          });
                        }}
                        onBlur={(e) => {
                          console.log('TextField onBlur:', e.target.value);
                          handleBlur(e);
                        }}
                        error={
                          touched[`movements.${index}.movementName`] &&
                          Boolean(errors[`movements.${index}.movementName`])
                        }
                        helperText={
                          touched[`movements.${index}.movementName`] &&
                          errors[`movements.${index}.movementName`]
                        }
                      />
                      <FormControl className={classes.textField}>
                        <InputLabel
                          htmlFor={`movements.${index}.movementLevel`}
                        >
                          Movement Level (Required)
                        </InputLabel>
                        <Select
                          labelId={`movements.${index}.movementLevel-label`}
                          id={`movements.${index}.movementLevel`}
                          name={`movements.${index}.movementLevel`}
                          value={value.movementLevel}
                          onChange={(e) => {
                            const value = e.target.value as
                              | 'Yellow'
                              | 'Green'
                              | 'Red';
                            setValues((prevMovements) => {
                              const updatedMovements = prevMovements.map(
                                (movement, i) => {
                                  if (i === index) {
                                    return {
                                      ...movement,
                                      movementLevel: value,
                                    };
                                  }
                                  return movement;
                                }
                              );
                              return updatedMovements;
                            });
                          }}
                          onBlur={(e) => {
                            console.log('Select onBlur:', e.target.value);
                            handleBlur(e);
                          }}
                          error={
                            touched[`movements.${index}.movementLevel`] &&
                            Boolean(errors[`movements.${index}.movementLevel`])
                          }
                          inputProps={{
                            name: `movements.${index}.movementLevel`,
                          }}
                        >
                          <MenuItem value="Yellow">Yellow</MenuItem>
                          <MenuItem value="Green">Green</MenuItem>
                          <MenuItem value="Red">Red</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  ))}
                </div>
              )}
            </FieldArray>
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              type="submit"
            >
              Save
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddMovementScreenPage;
