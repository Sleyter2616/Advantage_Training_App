import React from 'react';
import { useNavigate } from 'react-router-dom';
import {  TableCell, Button } from '@material-ui/core';
import {  History, MovementScreen} from '../../types';
import { makeStyles } from '@material-ui/core/styles';

interface MemberProps {
  member: {
    id: string;
    firstName: string;
    lastName:string
    dob: Date | undefined;
    height: number |undefined;
    weight: number |undefined;
    goals: string;
    memberNotes?: string;
    movementsScreen:MovementScreen[];
    history: History[];
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
const MemberDisplay: React.FC<MemberProps> = ({ member }) => {
  const classes = useStyles();
  const navigate = useNavigate();
const handleEditMovementScreenClick = () => {
  navigate(`/member/${member.id}/edit-movement-screen/`);
};
const handleViewHistory = () => {
  navigate(`/member/${member.id}/view-history`);

};
const calculateAge=(dateOfBirth: Date): string  => {
    const dob = new Date(dateOfBirth);
  
    if (isNaN(dob.getTime())) {
      return 'N/A';
    }
    const ageDiffMs = Date.now() - dob.getTime();
    const ageDate = new Date(ageDiffMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    return age.toString()
  }
  
  function inchesToHeight(inches: number): string {
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}'${remainingInches}"`;
  }
const memberName = `${member.firstName} ${member.lastName}`
console.log(member.dob)
  return (
   <>
      <TableCell>{memberName}</TableCell>
      <TableCell>{member.dob ? calculateAge(member.dob): ''}</TableCell>
      <TableCell>{member.height ? inchesToHeight(member.height) :''}</TableCell>
      <TableCell>{member.weight} lbs</TableCell>
      <TableCell>{member.goals}</TableCell>
      <TableCell>{member.memberNotes}</TableCell>
      <TableCell>   <Button variant="contained" color="primary"   className={classes.submit} onClick={handleEditMovementScreenClick}>
     Edit Movement Screen
    </Button>
    </TableCell>
    <TableCell>
        <Button
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={handleViewHistory}
        >
       View Member History
        </Button>
      </TableCell>
   </>
  );
};

export default MemberDisplay;
