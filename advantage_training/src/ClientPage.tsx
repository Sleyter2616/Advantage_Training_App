import React from 'react';
import { TableRow, TableCell } from '@material-ui/core';

interface ClientProps {
  client: {
    id: number;
    name: string;
    dob: string;
    height: string;
    weight: string;
    goals: string;
    notes: string;
    program: string;
  };
}

const formatNumber = (value: number): string => {
  return value.toLocaleString('en-US');
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US');
}

const Client: React.FC<ClientProps> = ({ client }) => {
  const heightInInches = Math.round(parseInt(client.height));
  const weightInLbs = Math.round(parseInt(client.weight));

  return (
    <TableRow key={client.id}>
      <TableCell>{client.name}</TableCell>
      <TableCell>{formatDate(client.dob)}</TableCell>
      <TableCell>{heightInInches} in</TableCell>
      <TableCell>{formatNumber(weightInLbs)} lbs</TableCell>
      <TableCell>{client.goals}</TableCell>
      <TableCell>{client.notes}</TableCell>
      <TableCell>{client.program}</TableCell>
    </TableRow>
  );
};

export default Client;
