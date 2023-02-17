import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Program, Client, } from "./types";
import { Formik, Form } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Typography,
  Grid,
  TextareaAutosize,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { clientsRef } from "../firebaseConfig";
import {
  doc,
  onSnapshot,
  DocumentReference,
  updateDoc,
} from "firebase/firestore";
import Header from "../components/Header";

interface AddProgramPageProps {
  onAddTrainingProgram: (trainingProgram: Program) => void;
}

const useStyles = makeStyles(() => ({
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "1rem",
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
  textField: {
    width: "100%",
    marginBottom: "1rem",
  },
  textArea: {
    width: "100%",
    minHeight: "4rem",
    marginBottom: "1rem",
  },
  logout: {
    margin: "1rem",
  },
  button: {
    margin: "1rem",
    background: "#3f51b5",
    color: "#fff",
    "&:hover": {
      background: "#303f9f",
    },
  },
}));

const AddProgram: React.FC<AddProgramPageProps> = ({
  onAddTrainingProgram,
}) => {
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const classes = useStyles();
  const { id } = useParams();
  const clientRef: DocumentReference = doc(clientsRef, id);

  const [values, setValues] = useState({
    id: uuidv4(),
    programName: "",
    programNotes: "",
    days: [
      {
        dayName: "",
        dayNotes: "",
        movements: [
          {
            movementName: "",
            weight: "",
            sets: "",
            reps: "",
          },
        ],
      },
    ],
  });


  useEffect(() => {
    console.log("Fetching client with ID", id);
    console.log(values);
    const unsubscribe = onSnapshot(clientRef, (doc) => {
      setClient(doc.data() as Client);
    });
    return () => {
      unsubscribe();
    };
  }, [id]);

  const handleSubmit = async (values: Program) => {
    console.log("HELLO");
    const newTrainingProgramWithId = { ...values };
    onAddTrainingProgram(newTrainingProgramWithId);
    console.log(client, "client");
    if (client) {
      const newPrograms = [...client.programs, newTrainingProgramWithId];
      try {
        await updateDoc(clientRef, { programs: newPrograms });
        console.log("Client programs updated successfully");
        navigate(`/client/${id}/programs`);
      } catch (error) {
        console.error("Error updating client programs:", error);
      }
    }
  };

  const validationSchema = Yup.object({
    id: Yup.string().required("Required"),
    programName: Yup.string().required("Required"),
    programNotes: Yup.string().notRequired(),
    days: Yup.array()
      .of(
        Yup.object().shape({
          dayName: Yup.string().required("Required"),
          dayNotes: Yup.string().notRequired(),
          movements: Yup.array()
            .of(
              Yup.object().shape({
                movementName: Yup.string().required("Required"),
                weight: Yup.string().required("Required"),
                sets: Yup.string().required("Required"),
                reps: Yup.string().required("Required"),
              })
            )
            .min(1),
        })
      )
      .min(1),
  });

  return (
    <div>
      <Header />
      <Typography variant="h3" align="center">
        Add New Training Program
      </Typography>
      <Typography variant="h4" align="center">
        {client ? `Client: ${client.firstName} ${client.lastName}` : ""}
      </Typography>
      <Formik
        initialValues={values}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleBlur, errors, touched, setValues }) => (
          <Form className={classes.form}>
            <Typography variant="h5" align="center">
              Program Details
            </Typography>
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
              {values.days.map((day, index) => (
                <React.Fragment key={`days.${index}`}>
                  <Grid container item xs={12} justifyContent="center">
                    <Typography variant="h5" align="center">
                      Day Details
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      className={classes.textField}
                      id={`days.${index}.dayName`}
                      label={`Name of day`}
                      name={`days.${index}.dayName`}
                      value={day.dayName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid container item xs={12} justifyContent="center">
                    <Button
                      className={classes.button}
                      onClick={() => {
                        const newMovement = {
                          movementName: "",
                          weight: "0",
                          sets: "0",
                          reps: "0",
                        };
                        const newDays = [...values.days];
                        newDays[index].movements.push(newMovement);
                        handleChange({
                          target: {
                            name: `days.${index}.movements`,
                            value: newDays[index].movements,
                          },
                        });
                      }}
                    >
                      Add Movement to {day.dayName}
                    </Button>
                  </Grid>
                  {day.movements.map((movement, movementIndex) => (
                    <div
                      key={`days.${index}.movements.${movementIndex}`}
                      style={{ padding: "1rem", border: "1px dashed black" }}
                    >
                      <Grid item xs={12} sm={10}>
                        <TextField
                          className={classes.textField}
                          id={`days.${index}.movements.${movementIndex}.movementName`}
                          label="Movement Name"
                          name={`days.${index}.movements.${movementIndex}.movementName`}
                          value={movement.movementName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            touched.days?.[index]?.movements?.[movementIndex]
                              ?.reps &&
                            movement.movementName === "" &&
                            Boolean(errors.days)
                          }
                          helperText={
                            touched.days?.[index]?.movements?.[movementIndex]
                              ?.reps &&
                            movement.movementName === "" &&
                            Boolean(errors.days) &&
                            " Please fill this field"
                          }
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
                          error={
                            touched.days?.[index]?.movements?.[movementIndex]
                              ?.weight &&
                            movement.weight === "" &&
                            Boolean(errors.days)
                          }
                          helperText={
                            touched.days?.[index]?.movements?.[movementIndex]
                              ?.weight &&
                            movement.weight === "" &&
                            Boolean(errors.days) &&
                            " Please fill this field"
                          }
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
                          error={
                            touched.days?.[index]?.movements?.[movementIndex]
                              ?.sets &&
                            movement.sets === "" &&
                            Boolean(errors.days)
                          }
                          helperText={
                            touched.days?.[index]?.movements?.[movementIndex]
                              ?.sets &&
                            movement.sets === "" &&
                            Boolean(errors.days) &&
                            " Please fill this field"
                          }
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
                          error={
                            touched.days?.[index]?.movements?.[movementIndex]
                              ?.reps &&
                            movement.reps === "" &&
                            Boolean(errors.days)
                          }
                          helperText={
                            touched.days?.[index]?.movements?.[movementIndex]
                              ?.reps &&
                            movement.reps === "" &&
                            Boolean(errors.days) &&
                            " Please fill this field"
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={10}>
                        <Button
                          className={classes.logout}
                          variant="contained"
                          color="secondary"
                          onClick={() => {
                            const newDays = [...values.days];
                            newDays[index].movements.splice(movementIndex, 1);
                            handleChange({
                              target: {
                                name: `days.${index}.movements`,
                                value: newDays[index].movements,
                              },
                            });
                          }}
                        >
                          Remove Movement
                        </Button>
                      </Grid>
                    </div>
                  ))}
                  <Grid container item xs={12} justifyContent="center">
                    <Button
                      className={classes.logout}
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        const newDays = [...values.days];
                        newDays.splice(index, 1);
                        handleChange({
                          target: {
                            name: "days",
                            value: newDays,
                          }
                        })
                      }}
                    >
                      Remove Day {day.dayName}
                    </Button>
                  </Grid>
                  <Grid container item xs={12} justifyContent="center">
                    <Typography>Notes for {day.dayName}</Typography>
                    <TextareaAutosize
                      className={classes.textArea}
                      id={`days.${index}.dayNotes`}
                      // label={`Notes for day`}
                      name={`days.${index}.dayNotes`}
                      value={day.dayNotes}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>

            <Button
              className={classes.button}
              onClick={() => {
                const newDay = {
                  dayName: `Day ${values.days.length + 1}`,
                  movements: [
                    { movementName: "", weight: "0", sets: "0", reps: "0" },
                  ],
                  dayNotes: "",
                };
                const newDays = [...values.days, newDay];
                const newValues = { ...values, days: newDays };
                setValues(newValues);
              }}
            >
              Add Day to {values.programName}
            </Button>
            <Button className={classes.button} type="submit">
              Save program  {values.programName}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddProgram;
