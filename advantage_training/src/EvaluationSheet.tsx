import React from 'react';
import { Table, TableBody, TableRow, TableCell } from '@material-ui/core';

interface Movement {
  name: string;
  weight: number;
  sets: number;
  reps: number;
}
interface NotesHistory {
  date: string;
  notes: string;
}
interface EvaluationSheetProps {
  evalSheetData: {
    name: string;
    age: number;
    goals: string;
    notes: string;
    movements: Movement[];
    notesHistory: NotesHistory[];
  };
}
const EvaluationSheet: React.FC<EvaluationSheetProps> = ({ evalSheetData }) => {
  const { name, age, goals, notes, movements, notesHistory } = evalSheetData;

  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>Name:</TableCell>
          <TableCell>{name}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Age:</TableCell>
          <TableCell>{age}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Goals:</TableCell>
          <TableCell>{goals}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Notes:</TableCell>
          <TableCell>{notes}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Movements:</TableCell>
          <TableCell>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Weight</TableCell>
                  <TableCell>Sets</TableCell>
                  <TableCell>Reps</TableCell>
                </TableRow>
                {movements.map((movement) => (
                  <TableRow key={movement.name}>
                    <TableCell>{movement.name}</TableCell>
                    <TableCell>{movement.weight}</TableCell>
                    <TableCell>{movement.sets}</TableCell>
                    <TableCell>{movement.reps}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Additional Notes:</TableCell>
          <TableCell>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Note</TableCell>
                </TableRow>
                {notesHistory.map((note) => (
                  <TableRow key={note.date}>
                    <TableCell>{note.date}</TableCell>
                    <TableCell>{note.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default EvaluationSheet;
