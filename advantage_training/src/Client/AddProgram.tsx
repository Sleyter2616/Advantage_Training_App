import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TrainingProgram, Movement } from './types';
import { Formik, Form, Field } from 'formik';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import { TextField, Button, Typography, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

interface AddProgramPageProps {
  onAddTrainingProgram: (trainingProgram: TrainingProgram) => void;
}

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

const days = ['Monday', 'Tuesday', 'Wednesday'];



const AddProgram: React.FC<AddProgramPageProps> = ({ onAddTrainingProgram }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const clientName = location.state?.clientName;

  const classes = useStyles();
  const { clientId } = useParams();
  const defaultClientId = clientId || ""; // set a default value of empty string if clientId is undefined
  const [values, setValues] = useState<TrainingProgram>({
    id: uuidv4(),
    clientId: defaultClientId,
    programName: '',
    program: [
      { day: 'Day 1', movements: [{ id: uuidv4(), name: '', weight: 0, sets: 0, reps: 0 }] },
    ],
  });
  

  const handleSubmit = (values: TrainingProgram) => {
    const newTrainingProgramWithId = { ...values, id: uuidv4() };
    onAddTrainingProgram(newTrainingProgramWithId);
    navigate(`/clients/${clientId}`);
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    program: Yup.array().of(
      Yup.object().shape({
        day: Yup.string().required('Required'),
        movements: Yup.array().of(
          Yup.object().shape({
            name: Yup.string().required('Required'),
          })
        ).required(),
      })
    ).min(1).max(7),
  });

  return (
    <div>
      <Typography variant="h4" component="h1" align="center">
        Add New Training Program
      </Typography>
      <Typography variant="h5" component="h2" align="center">
  {`Client: ${clientName}`}
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
              id="programName"
              label="Program Name"
              name="programName"
              value={values.programName}
              onChange={handleChange}
              onBlur={handleBlur}
            />

<Grid container spacing={2}>
{values.program
  .filter(day => values.program.map(day => day.day).includes(day.day))
  .map((day, index) => (
    <React.Fragment key={day.day}>
      <Grid item xs={12}>
        <Typography variant="h5" component="h2" align="center">
          {day.day}
        </Typography>
        <Button
                className={classes.button}
                onClick={() => {
                  const newMovement = {  id: uuidv4(), name: '', weight: 0, sets: 0, reps: 0 };
                  const newProgram = [...values.program];
                  newProgram[index].movements.push(newMovement);
                  handleChange({ target: { name: `trainingProgram[${index}].movements`, value: newProgram[index].movements } });
                }}
              >
                Add Movement to {day.day}
              </Button>
      </Grid>
  {day.movements.map((movement, movementIndex) => (
    <div key={movement.id} style={{ margin: '1rem' }}>
      <Grid item xs={12} sm={10}>
        <TextField
          className={classes.textField}
          id={`program.${index}.movements.${movementIndex}.name`}
          label="Movement"
          name={`program.${index}.movements.${movementIndex}.name`}
          value={movement.name}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </Grid>
      <Grid item xs={12} sm={10}>
        <TextField
          className={classes.textField}
          id={`program.${index}.movements.${movementIndex}.weight`}
          label="Weight (lbs)"
          name={`program.${index}.movements.${movementIndex}.weight`}
          type="number"
          value={movement.weight}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </Grid>
      <Grid item xs={12} sm={10}>
        <TextField
          className={classes.textField}
          id={`program.${index}.movements.${movementIndex}.sets`}
          label="Sets"
          name={`program.${index}.movements.${movementIndex}.sets`}
          type="number"
          value={movement.sets}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </Grid>
      <Grid item xs={12} sm={10}>
        <TextField
          className={classes.textField}
          id={`program.${index}.movements.${movementIndex}.reps`}
          label="Reps"
          name={`program.${index}.movements.${movementIndex}.reps`}
          value={movement.reps}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </Grid>
      <Grid item xs={12} sm={10}>
        <TextField
          className={classes.textField}
          id={`program.${index}.movements.${movementIndex}.notes`}
          label="Notes"
          name={`program.${index}.movements.${movementIndex}.notes`}
          value={movement.notes}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </Grid>
    </div>
  ))}

      <Grid item xs={12}>
        {values.program.length - 1 === index && (
        <Button
        className={classes.button}
        variant="contained"
        onClick={() =>
           handleChange({
              target: {
                 name: `program[${values.program.length}]`,
                 value: {
                    day: `Day ${values.program.length + 1}`,
                    movements: [{ id: uuidv4(), name: '', weight: 0, sets: 0, reps: 0 }],
                 },
              },
           })
        }
     >
        Add Day to Program
     </Button>
        )}
      </Grid>
    </React.Fragment>
  ))
}
        </Grid>
        <Button className={classes.button} variant="contained" type="submit">
          Add Program
        </Button>
      </Form>
    )}
  </Formik>
</div>);
};

export default AddProgram;