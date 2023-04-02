import React from 'react';
import { useNavigate } from 'react-router-dom';
import {  TableCell, Button } from '@material-ui/core';
import {  Program} from '../../types';
import { makeStyles } from '@material-ui/core/styles';

interface ClientProps {
  client: {
    id: string;
    firstName: string;
    lastName: string;
    dob: string;
    height: string;
    weight: string;
    goals: string;
    clientNotes?: string;
    programs: Program[];

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
  navigate(`/client/${client.id}/programs`);
};
const handleAddProgram = () => {
  navigate(`/client/${client.id}/add-program`);

};
  const heightInInches = Math.round(parseInt(client.height));
  const weightInLbs = Math.round(parseInt(client.weight));
const clientName = `${client.firstName} ${client.lastName}`
console.log(client)
  return (
   <>
      <TableCell>{clientName}</TableCell>
      <TableCell>{calculateAge(client.dob)}</TableCell>
      <TableCell>{heightInInches} in</TableCell>
      <TableCell>{formatNumber(weightInLbs)} lbs</TableCell>
      <TableCell>{client.goals}</TableCell>
      <TableCell>{client.clientNotes}</TableCell>
      <TableCell> {client.programs?.length > 0 ?(   <Button variant="contained" color="primary"   className={classes.submit} onClick={handleViewProgramClick}>
      View/Edit Programs
    </Button>):'No programs created yet'}</TableCell>
    <TableCell>
        <Button
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={handleAddProgram}
        >
          Add New Program
        </Button>
      </TableCell>
   </>
  );
};

export default ClientDisplay;
