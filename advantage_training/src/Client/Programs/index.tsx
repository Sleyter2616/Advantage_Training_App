import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody, Button, Divider
} from "@material-ui/core";

import {
  handleProgramNameChange,
  handleAddDay,
  handleDayNameChange,
  handleDayNotesChange,
  handleMovementNameChange,
  handleDeleteDay,
  handleMovementWeightChange,
  handleMovementSetsChange,
  handleMovementRepsChange,
  handleDeleteMovement,
  handleAddMovement
} from "./helpers";
import EditableText from "./EditableText";
import { Program } from "../types";

interface ProgramsParams extends Record<string, string | undefined> {
  clientId: string;
}

interface Movement {
  name: string;
  weight: string;
  sets: string;
  reps: string;
}

interface Day {
  name: string;
  movements: Movement[];
  notes?: string;
}


const buttonStyle={
    margin:'12px'
}

const Programs = () => {
  const { clientId } = useParams<ProgramsParams>();
  const [programs, setPrograms] = useState<Array<Program>>([]);
  const [editing, setEditing] = useState<{ [key: string]: boolean }>({});
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // send the program data to the backend
    console.log(programs);
  }

  useEffect(() => {
    // fetch the program data for the client from an API or a local store
    const fetchedPrograms = [
      {
        id: "1",
        clientId:'',
        programName: "Weight Loss",
        days: [
          {
            name: "Day 1",
            movements: [
              { name: "Squat", weight: "200", sets: "3", reps: "8" },
              { name: "Deadlift", weight: "225", sets: "3", reps: "6" },
              { name: "Bench Press", weight: "155", sets: "3", reps: "10" },
              { name: "Pull-up", weight: "0", sets: "3", reps: "6" },
            ],
            notes: "Client was feeling fatigued during workout",
          },
          {
            name: "Day 2",
            movements: [
              {
                name: "Squat",
                weight: "205",
                sets: "3",
                reps: "8",
              },
              {
                name: "Deadlift",
                weight: "235",
                sets: "3",
                reps: "6",
              },
              {
                name: "Bench Press",
                weight: "165",
                sets: "3",
                reps: "10",
              },
              {
                name: "Pull-up",
                weight: "0",
                sets: "3",
                reps: "6",
              },
            ],
            notes: "",
          },
          {
            name: "Day 3",
            movements: [
              {
                name: "Squat",
                weight: "235",
                sets: "3",
                reps: "8",
              },
              {
                name: "Deadlift",
                weight: "265",
                sets: "3",
                reps: "6",
              },
              {
                name: "Bench Press",
                weight: "185",
                sets: "3",
                reps: "10",
              },
              {
                name: "Pull-up",
                weight: "0",
                sets: "3",
                reps: "8",
              },
            ],
            notes: "",
          },
        ],
        notesHistory: [
          {
            date: "2022-02-10",
            notes: "Client was feeling fatigued during workout",
          },
          {
            date: "2022-02-07",
            notes: "Client was able to complete all sets and reps",
          },
        ],
      },

    ];
    setPrograms(fetchedPrograms);
  }, [clientId]);

  return (
    <form onSubmit={handleSubmit}>

      <Typography variant="h3" align="center">
        Programs for client {clientId}
      </Typography>
      {programs.map((program, programIndex) => (
        <React.Fragment key={program.id}>
          {programIndex > 0 && <Divider component="div" role="presentation"/>}
          <Typography variant="h6" align="center">
         Program Name
          </Typography>
          <Typography variant="h6" align="center">
            <EditableText
              value={program.programName}
              onChange={(newName:string) => handleProgramNameChange(program.id, newName, programs, setPrograms)}
            />
          </Typography>
          {program.days.map((day, dayIndex) => (
            <div key={dayIndex}>
              <Typography variant="h5" align="center">
                <EditableText
                  value={day.name}
                  onChange={(newName:string) =>
                    handleDayNameChange(program.id, dayIndex, newName, programs, setPrograms)
                  }
                />
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Exercise Name</TableCell>
                    <TableCell>Weight</TableCell>
                    <TableCell>Sets</TableCell>
                    <TableCell>Reps</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {day.movements.map((movement, movementIndex) => (
                    <TableRow key={movementIndex}>
                      <TableCell>
                        <EditableText
                          value={movement.name}
                          onChange={(newName:string) =>
                            handleMovementNameChange(
                              program.id,
                              dayIndex,
                              movementIndex,
                              newName,
                              programs, setPrograms
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <EditableText
                          value={movement.weight}
                          onChange={(newWeight:string) =>
                            handleMovementWeightChange(
                              program.id,
                              dayIndex,
                              movementIndex,
                              newWeight, programs, setPrograms
                            )
                          }
                        />
                        lbs
                      </TableCell>
                      <TableCell>
                        <EditableText
                          value={movement.sets}
                          onChange={(newSets:string) =>
                            handleMovementSetsChange(
                              program.id,
                              dayIndex,
                              movementIndex,
                              newSets, programs, setPrograms
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <EditableText
                          value={movement.reps}
                          onChange={(newReps:string) =>
                            handleMovementRepsChange(
                              program.id,
                              dayIndex,
                              movementIndex,
                              newReps, programs, setPrograms
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() =>
                            handleDeleteMovement(
                              program.id,
                              dayIndex,
                              movementIndex, programs, setPrograms
                            )
                          }
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Typography align="center"
             >
                 <Button
                   style={buttonStyle}
                variant="contained"
                color="secondary"
                onClick={() => handleDeleteDay(program.id, dayIndex, programs, setPrograms)}
              >
                Delete {day.name}
              </Button>
              <Button
               style={buttonStyle}
                variant="contained"
                color="primary"
                onClick={() => handleAddMovement(program.id, dayIndex, programs, setPrograms)}
              >
                Add Exercise to {day.name}
              </Button>
              </Typography>
              <Typography variant="h6" align="center">
                Notes:{" "}
                </Typography>
                <Typography  align="center">
         <EditableText
                  value={day.dayNotes ? day.dayNotes :''}
                  onChange={(newNotes:string) =>
                    handleDayNotesChange(program.id, dayIndex, newNotes, programs, setPrograms)
                  }
                />
              </Typography>

              <Divider component="div" role="presentation" style={{
                margin:'60px 0px'
              }}/>
            </div>
          ))}
           <Typography align="center">
          <Button
             style={buttonStyle}
            variant="contained"
            color="primary"
            onClick={() => handleAddDay(program.id, programs, setPrograms)}
          >
            Add Day to program "{program.programName}"
          </Button>
          </Typography>
          <Typography align="center">
          <Button type="submit" variant="contained" color="primary">
      Submit programs
    </Button>
</Typography>
        </React.Fragment>

      ))}
    </form>
  );

};

export default Programs;


