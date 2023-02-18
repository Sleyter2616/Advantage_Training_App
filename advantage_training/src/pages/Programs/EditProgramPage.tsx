import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  TableCell,
  TableBody, TableHead,
  TableRow,
  Table
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { v4 as uuidv4 } from "uuid";
import { Program, Day, Movement } from "../../Client/types";
import { doc, getDoc, setDoc ,  DocumentReference,} from "firebase/firestore";
import { db, clientsRef } from "../../firebaseConfig";
import Header from "../../components/Header";

interface EditProgramPageParams extends Record<string, string > {
    clientId:string;
    programId: string;
  }

  const EditProgramPage = () => {
    const { clientId, programId } = useParams<EditProgramPageParams>();
    const [program, setProgram] = useState<Program | null>(null);
    const [programName, setProgramName] = useState("");
    const [days, setDays] = useState<Array<Day>>([]);
  const navigate = useNavigate()
    useEffect(() => {
        const getClients = async () => {
        const clientRef: DocumentReference = doc(clientsRef, clientId);
          const clientSnapshot = await getDoc(clientRef);
          if (clientSnapshot.exists()) {
            const clientData = clientSnapshot.data();

            const programData = clientData?.programs?.find(
              (program: Program) => program.id === programId,
            );
            if (programData) {
              setProgram(programData);
              setProgramName(programData.programName);
              setDays(programData.days);
            } else {
              console.log("Program not found");
            }
          } else {
            console.log("Client not found");
          }
        };
        getClients();
      }, [clientId, programId]);

    const handleProgramNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setProgramName(event.target.value);
    };

    const handleDayNameChange = (dayIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
      const updatedDays = [...days];
      updatedDays[dayIndex].dayName = event.target.value;
      setDays(updatedDays);
    };
  
    const handleDayNotesChange = (dayIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
      const updatedDays = [...days];
      updatedDays[dayIndex].dayNotes = event.target.value;
      setDays(updatedDays);
    };
  
    const handleMovementNameChange = (dayIndex: number, movementIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
      const updatedDays = [...days];
      updatedDays[dayIndex].movements[movementIndex].movementName = event.target.value;
      setDays(updatedDays);
    };
  
    const handleMovementWeightChange = (dayIndex: number, movementIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
      const updatedDays = [...days];
      updatedDays[dayIndex].movements[movementIndex].weight = String(event.target.value);
      setDays(updatedDays);
    };
  
    const handleMovementSetsChange = (dayIndex: number, movementIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
      const updatedDays = [...days];
      updatedDays[dayIndex].movements[movementIndex].sets = String(event.target.value);
      setDays(updatedDays);
    };
  
    const handleMovementRepsChange = (dayIndex: number, movementIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
      const updatedDays = [...days];
      updatedDays[dayIndex].movements[movementIndex].reps = String(event.target.value);
      setDays(updatedDays);
    };
  
    const handleAddDay = () => {
        const newDay: Day = {
          dayName: "",
          movements: [],
          dayNotes:''
        };
        const updatedDays = [...days, newDay];
        setDays(updatedDays);
      };
      
      const handleDeleteDay = (dayIndex: number) => {
        const updatedDays = [...days];
        updatedDays.splice(dayIndex, 1);
        setDays(updatedDays);
      };
      
      const handleAddMovement = (dayIndex: number) => {
        const newMovement: Movement = {
          movementName: "",
          weight: '0',
          sets: '0',
          reps: '0',
        };
        const updatedDays = [...days];
        updatedDays[dayIndex].movements.push(newMovement);
        setDays(updatedDays);
      };

      const handleDeleteMovement = (dayIndex: number, movementIndex: number) => {
        const updatedDays = [...days];
        updatedDays[dayIndex].movements.splice(movementIndex, 1);
        setDays(updatedDays);
      };

    const handleSubmit = async () => {
  try {
    const clientRef: DocumentReference = doc(clientsRef, clientId);
    const clientSnapshot = await getDoc(clientRef);
    if (!clientSnapshot.exists()) {
      console.log("Client not found");
      return;
    }

    const clientData = clientSnapshot.data();
    const updatedProgramIndex = clientData.programs.findIndex(
      (program: Program) => program.id === programId
    );
    if (updatedProgramIndex === -1 || !programId) {
      console.log("Program not found");
      return;
    }

    const updatedProgram: Program = {
      id: programId,
      programName: programName,
      days: days,
    };

    const updatedPrograms = [...clientData.programs];
    updatedPrograms[updatedProgramIndex] = updatedProgram;

    await setDoc(clientRef, { programs: updatedPrograms }, { merge: true });
    console.log("Program updated!");
    navigate(`/client/${clientId}/programs`)
  } catch (error) {
    console.error("Error updating program", error);
  }
};
const handleDeleteProgram = async () => {
  try {
    const clientRef: DocumentReference = doc(clientsRef, clientId);
    const clientSnapshot = await getDoc(clientRef);
    if (!clientSnapshot.exists()) {
      console.log("Client not found");
      return;
    }

    const clientData = clientSnapshot.data();
    const updatedPrograms = clientData.programs.filter((program: Program) => program.id !== programId);

    await setDoc(clientRef, { programs: updatedPrograms }, { merge: true });
    console.log("Program deleted!");
    navigate(`/client/${clientId}/programs`);
  } catch (error) {
    console.error("Error deleting program", error);
  }
};


      return (
        <>
        <Header />
          <Box display="flex" justifyContent="center" mt={3}>
            <Typography variant="h3" align="center">
              Edit Program
            </Typography>
          </Box>
          {program && (
            <>
              <Box display="flex" justifyContent="center" mt={3}>
                <TextField
                  label="Program Name"
                  variant="outlined"
                  value={programName}
                  onChange={handleProgramNameChange}
                />
              </Box>
              
              {days.map((day, dayIndex) => (
                <Box key={dayIndex} mt={3}>
                  <Typography variant="h5" align="center">
                  {day.dayName}
                  </Typography>
                  <Box display="flex" justifyContent="center" mt={3}>
                    <TextField
                      label="Day Name"
                      variant="outlined"
                      value={day.dayName}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        handleDayNameChange(dayIndex, event)
                      }
                      style={{ marginBottom: "1rem" }}
                    />
                  </Box>
                  <Box display="flex" justifyContent="center" mt={3}>
                    <TextField
                      label="Day Notes"
                      variant="outlined"
                      value={day.dayNotes}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleDayNotesChange(dayIndex, event)}
                    />
                  </Box>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Exercise Name</TableCell>
                        <TableCell>Weight (lbs)</TableCell>
                        <TableCell>Sets</TableCell>
                        <TableCell>Reps</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {day.movements.map((movement, movementIndex) => (
                        <TableRow key={movementIndex}>
                          <TableCell>
                            <TextField
                              value={movement.movementName}
                              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                handleMovementNameChange(
                                  dayIndex,
                                  movementIndex,
                                  event
                                )
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="string"
                              value={movement.weight}
                              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                handleMovementWeightChange(
                                  dayIndex,
                                  movementIndex,
                                  event
                                )
                            }
                            InputProps={{
                              inputProps: { min: 0 },
                            }}
                          />
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="string"
                              value={movement.sets}
                              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                handleMovementSetsChange(
                                  dayIndex,
                                  movementIndex,
                                  event
                                )
                              }
                              InputProps={{
                                inputProps: { min: 0 },
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="string"
                              value={movement.reps}
                              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                handleMovementRepsChange(
                                  dayIndex,
                                  movementIndex,
                                  event
                                )
                              }
                              InputProps={{
                                inputProps: { min: 0 },
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              aria-label="delete movement"
                              onClick={() =>
                                handleDeleteMovement(dayIndex, movementIndex)
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Box display="flex" justifyContent="center" mt={3}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAddMovement(dayIndex)}
                    >
                      Add Movement
                    </Button>
                  </Box>
                  <Box display="flex" justifyContent="center" mt={3}>
                    <IconButton
                      aria-label="delete day"
                      onClick={() => handleDeleteDay(dayIndex)}
                    >
                      Delete {day.dayName}
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  <Divider variant="middle" />
                </Box>
              ))}
              <Box display="flex" justifyContent="center" mt={3}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddDay}
                >
                  Add Day
                </Button>
              </Box>
              <Box display="flex" justifyContent="center" mt={3} margin="10px">
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                  Save Changes
                </Button>
              </Box>
              <Box display="flex" justifyContent="center" mt={3}>
  <Button variant="contained" color="secondary" onClick={handleDeleteProgram}>
    Delete Program
  </Button>
</Box>
            </>
          )}
        </>
      );
    };
    export default EditProgramPage;