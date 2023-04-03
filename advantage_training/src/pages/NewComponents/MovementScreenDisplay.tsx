import React from 'react';

import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core';
import { Member, MovementScreen } from '../../types';

interface MovementScreenPageProps {
  member: Member;
}

const MovementScreenPage: React.FC<MovementScreenPageProps> = ({ member }) => {
  const getRowClass = (movementLevel: MovementScreen['movementLevel']) => {
    switch (movementLevel) {
      case 'Green':
        return 'green-row';
      case 'Yellow':
        return 'yellow-row';
      case 'Red':
        return 'red-row';
      default:
        return '';
    }
  };

  return (
    <>
      <Typography variant="h3" align="center">
        {member?.firstName} {member?.lastName} - Movement Screen
      </Typography>
      <Table style={{ width: 'auto', margin: 'auto' }}>
        <colgroup>
          <col style={{ width: '50%' }} />
          <col style={{ width: '50%' }} />
        </colgroup>
        <TableHead>
          <TableRow>
            <TableCell>Field</TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {member?.movementsScreen?.map((movement) => (
            <TableRow
              key={movement.id}
              className={getRowClass(movement.movementLevel)}
            >
              <TableCell>{movement.movementName}</TableCell>
              <TableCell>{movement.movementLevel}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
export default MovementScreenPage;
