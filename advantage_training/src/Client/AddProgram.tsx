import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Program, Movement, Client,Day } from './types';
import { Formik, Form, Field } from 'formik';
import { getAuth, signOut } from "firebase/auth";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import { TextField, Button, Typography, Grid, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { clientsRef } from '../firebaseConfig';
import { doc, onSnapshot, DocumentReference, updateDoc } from 'firebase/firestore';
import Header from '../components/Header';

interface AddProgramPageProps {
  onAddTrainingProgram: (trainingProgram: Program) => void;
}

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



const AddProgram: React.FC<AddProgramPageProps> = ({ onAddTrainingProgram }) => {
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const classes = useStyles();
  const { id } = useParams();
  const clientRef:DocumentReference = doc(clientsRef, id);
 

  const [values, setValues] = useState({
    id: uuidv4(),
    programName: '',
    programNotes:'',
    days: [{
      name: '',
      dayNotes: '',
      movements: [{
        name: '',
        weight: '',
        sets: '',
        reps: ''
      }]
    }
    ],
  });

  useEffect(() => {
    console.log('Fetching client with ID', id);
    console.log(values)
    const unsubscribe = onSnapshot(clientRef, (doc) => {
        setClient(doc.data() as Client);
    });
    return () => {
      unsubscribe();
    };
  }, [id]);

  const handleSubmit = async (values: Program) => {
    console.log('HELLO')
    const newTrainingProgramWithId = { ...values};
    onAddTrainingProgram(newTrainingProgramWithId);
    console.log(client,'client')
    if (client) {
      const newPrograms = [...client.programs, newTrainingProgramWithId];
      try {
        await updateDoc(clientRef,{ programs: newPrograms,})
        console.log('Client programs updated successfully');
        navigate(`/client/${id}/programs`);
      } catch (error) {
        console.error('Error updating client programs:', error);
      }
    }
  };


  const validationSchema =
 Yup.object({
  id:Yup.string().required('Required'),
            programName: Yup.string().required('Required'),
            programNotes:Yup.string().notRequired(),
            days: Yup.array().of(
              Yup.object().shape({
                name: Yup.string().required('Required'),
                dayNotes:Yup.string().notRequired(),
                movements: Yup.array().of(
                  Yup.object().shape({
                    name: Yup.string().required('Required'),
                    weight: Yup.string().required('Required'),
                    sets: Yup.string().required('Required'),
                    reps: Yup.string().required('Required'),
                  })
                ).min(1),
              })
            ).min(1),
          });

          return (
            <div >
            <Header/>
              <Typography variant="h4" component="h1" align="center">
                Add New Training Program
              </Typography>
              <Typography variant="h5" component="h2" align="center">
                {client ? `Client: ${client.firstName} ${client.lastName}` : ''}
              </Typography>
              <Formik
                initialValues={values}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ values, handleChange, handleBlur, errors, touched, setValues }) => (
                  <Form className={classes.form}>
                    <TextField
                      className={classes.textField}
                      id="programName"
                      label="Program Name"
                      name="programName"
                      value={values.programName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.programName && Boolean(errors.programName)}
                      helperText={touched.programName && errors.programName}
                    />
                     <TextField
                      className={classes.textField}
                      id="programNotes"
                      label="Program Notes"
                      name="programNotes"
                      value={values.programNotes}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.programNotes && Boolean(errors.programNotes)}
                      helperText={touched.programNotes && errors.programNotes}

                        />
                        <Grid container spacing={2}>
                          {values.days
                        .map((day, index) => (
                          <React.Fragment key={day.name}>
                            <Grid item xs={12}>
                              <Typography variant="h5" component="h2" align="center">
                                {day.name}
                              </Typography>
                              <TextField
                                className={classes.textField}
                                id={`days.${index}.dayNotes`}
                                label={`Notes for day`}
                                name={`days.${index}.dayNotes`}
                                value={day.dayNotes}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <Button
                                className={classes.button}
                                onClick={() => {
                                  const newMovement = { name: '', weight: '0', sets: '0', reps: '0' };
                                  const newDays = [...values.days];
                                  newDays[index].movements.push(newMovement);
                                  handleChange({ target: { name: `days.${index}.movements`, value: newDays[index].movements } });
                                }}
                              >
                                Add Movement to {day.name}
                              </Button>
                            </Grid>
                            {day.movements.map((movement, movementIndex) => (
                              <div key={`days.${index}.movements.${movementIndex}`} style={{ margin: '1rem' }}>
                                <Grid item xs={12} sm={10}>
                                <TextField
                                  className={classes.textField}
                                  id={`days.${index}.movements.${movementIndex}.name`}
                                  label="Movement"
                                  name={`days.${index}.movements.${movementIndex}.name`}
                                  value={movement.name}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={touched.days?.[index]?.movements?.[movementIndex]?.reps && movement.name ===''  && Boolean(errors.days)}
                                  helperText={touched.days?.[index]?.movements?.[movementIndex]?.reps && movement.name ===''  && Boolean(errors.days) &&' Please fill this field'}

                                    />

                                </Grid>
                                <Grid item xs={12} sm={10}>
                              <TextField
                                className={classes.textField}
                                id={`days.${index}.movements.${movementIndex}.weight`}
                                label="Weight"
                                name={`days.${index}.movements.${movementIndex}.weight`}
                                value={movement.weight}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.days?.[index]?.movements?.[movementIndex]?.weight && movement.weight ===''  && Boolean(errors.days)}
                                helperText={touched.days?.[index]?.movements?.[movementIndex]?.weight && movement.weight ===''  && Boolean(errors.days) &&' Please fill this field'}
                                />
                            </Grid>
                            <Grid item xs={12} sm={10}>
                              <TextField
                                className={classes.textField}
                                id={`days.${index}.movements.${movementIndex}.sets`}
                                label="Sets"
                                name={`days.${index}.movements.${movementIndex}.sets`}
                                value={movement.sets}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.days?.[index]?.movements?.[movementIndex]?.sets && movement.sets ===''  && Boolean(errors.days)}
                                 helperText={touched.days?.[index]?.movements?.[movementIndex]?.sets && movement.sets ===''  && Boolean(errors.days) &&' Please fill this field'}

                              />
                            </Grid>
                            <Grid item xs={12} sm={10}>
                              <TextField
                                className={classes.textField}
                                id={`days.${index}.movements.${movementIndex}.reps`}
                                label="Reps/Time"
                                name={`days.${index}.movements.${movementIndex}.reps`}
                                value={movement.reps}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.days?.[index]?.movements?.[movementIndex]?.reps && movement.reps ==='' && Boolean(errors.days)}
                                helperText={touched.days?.[index]?.movements?.[movementIndex]?.reps && movement.reps ===''  && Boolean(errors.days) &&' Please fill this field'}
                              />
                            </Grid>
                           <Grid item xs={12} sm={10}>
                              <Button
                                className={classes.button}
                                onClick={() => {
                                  const newDays = [...values.days];
                                  newDays[index].movements.splice(movementIndex, 1);
                                  handleChange({ target: { name: `days.${index}.movements`, value: newDays[index].movements } });
                                }}
                              >
                                Remove Movement
                              </Button>
                            </Grid>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                </Grid>
                <Divider />
                <Button className={classes.button} onClick={() => {
           const newDay = {
            name: `Day ${values.days.length + 1}`,
            movements: [{ name: '', weight: '0', sets: '0', reps: '0' }],
            dayNotes:''
          };
          const newDays = [...values.days, newDay];
          const newValues = { ...values, days: newDays };
          setValues(newValues);
      }}>
        Add Day
      </Button>
                <Button className={classes.button} type="submit">
                  Save
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      );
                }

export default AddProgram;