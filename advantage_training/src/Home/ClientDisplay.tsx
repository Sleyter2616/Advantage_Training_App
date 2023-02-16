import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TableRow, TableCell, Button } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

interface ClientProps {
  client: {
    id: string;
    name: string;
    dob: string;
    height: string;
    weight: string;
    goals: string;
    notes: string;
    // programs?: Program[];

  };
}
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(3),
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  table: {
    width: '100%',
    marginTop: theme.spacing(3),
  }
}));

const formatNumber = (value: number): string => {
  return value.toLocaleString('en-US');
}

const calculateAge=(dateOfBirth: string): string  => {
  const dob = new Date(dateOfBirth);

  if (isNaN(dob.getTime())) {
    return 'N/A'; // handle invalid date
  }
  const ageDiffMs = Date.now() - dob.getTime();
  const ageDate = new Date(ageDiffMs);
  const age = Math.abs(ageDate.getUTCFullYear() - 1970);
  return age.toString();
}
const ClientDisplay: React.FC<ClientProps> = ({ client }) => {
  const classes = useStyles();
  const navigate = useNavigate();
const handleViewProgramClick = () => {
  navigate(`/clients/${client.id}/programs`);
};
const handleAddProgram = () => {
  navigate(`/clients/${client.id}/add-program`);

};
  const heightInInches = Math.round(parseInt(client.height));
  const weightInLbs = Math.round(parseInt(client.weight));

  return (
   <>
      <TableCell>{client.name}</TableCell>
      <TableCell>{calculateAge(client.dob)}</TableCell>
      <TableCell>{heightInInches} in</TableCell>
      <TableCell>{formatNumber(weightInLbs)} lbs</TableCell>
      <TableCell>{client.goals}</TableCell>
      <TableCell>{client.notes}</TableCell>
      <TableCell>    <Button variant="contained" color="primary"   className={classes.submit} onClick={handleViewProgramClick}>
      View/Edit Programs
    </Button></TableCell>
    <TableCell>
        <Button
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={handleAddProgram}
        >
          Add Program for {client.name}
        </Button>
      </TableCell>
   </>
  );
};

export default ClientDisplay;
