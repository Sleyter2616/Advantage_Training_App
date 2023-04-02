import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Divider,
  Box
} from "@material-ui/core";
import { Link } from "react-router-dom";

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
  handleAddMovement,
} from "../Programs/helpers";
import { Program, Client } from "../../types";
import Header from "../../components/Header";
import { clientsRef } from "../../firebaseConfig";
import { doc, onSnapshot, DocumentReference } from "firebase/firestore";

interface ProgramsParams extends Record<string, string | undefined> {
  clientId: string;
}

const buttonStyle = {
  margin: "12px",
};

const ViewProgram = ({ program }: { program: Program }) => {
  const [expanded, setExpanded] = useState(false);
  const { clientId } = useParams<ProgramsParams>();
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <Typography variant="h6" align="center">
         {program.programName}
      </Typography>
      <div style={{
   display:'flex',
   justifyContent:'center',
   margin:'8px'
      }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleExpandClick}
      >
        View Program
      </Button>
      <Button
          variant="contained"
          color="secondary"
          component={Link}
          to={`/client/${clientId}/edit-program/${program.id}`}
          style={{ marginLeft: "8px" }}
        >
          Edit Program
        </Button>
      
      </div>

      {expanded && (
        <>
          {program.days.map((day, dayIndex) => (
            <div key={dayIndex}>
              <Typography variant="h5" align="center">
                {day.dayName}
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Exercise Name</TableCell>
                    <TableCell>Weight (lbs)</TableCell>
                    <TableCell>Sets</TableCell>
                    <TableCell>Reps</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {day.movements.map((movement, movementIndex) => (
                    <TableRow key={movementIndex}>
                      <TableCell>{movement.movementName}</TableCell>
                      <TableCell>{movement.weight} lbs</TableCell>
                      <TableCell>{movement.sets}</TableCell>
                      <TableCell>{movement.reps}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Typography variant="h6" align="center">
                Notes:{" "}
              </Typography>
              <Typography align="center">
                {day.dayNotes ? day.dayNotes : ""}
              </Typography>
              <Divider
                component="div"
                role="presentation"
                color="black"
                style={{ margin: "30px 0px" }}
              />
            </div>
          ))}
        </>
      )}
    </>
  );
};

const ViewProgramsPage = () => {
  const { clientId } = useParams<ProgramsParams>();
  const clientRef: DocumentReference = doc(clientsRef, clientId);
  const [client, setClient] = useState<Client | null>(null);
  const [programs, setPrograms] = useState<Array<Program>>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(clientRef, (doc) => {
      const clientData = doc.data() as Client;
      const programsData = clientData.programs;
      setClient(clientData);
      setPrograms(programsData);
    });
    return () => {
      unsubscribe();
    };
  }, [clientId]);

  return (
    <>
      <Header />
      <Typography variant="h3" align="center">
  Programs for {client?.firstName} {client?.lastName}
</Typography>
{programs.map((program, index) => (
< React.Fragment key={program.id}>{index ===0 &&
      <Divider
      component="div"
      role="presentation"
      color="black"
      style={{ margin: "15px 0px" }}
    />} 

  <ViewProgram key={program.id} program={program} />
  <Divider
                component="div"
                role="presentation"
                color="black"
                style={{ margin: "15px 0px" }}
              />
</ React.Fragment>
))}

  </>
  )}



export default ViewProgramsPage;
