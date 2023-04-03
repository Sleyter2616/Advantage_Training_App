import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Container,
  Typography,
  TableHead,
  TextField,
  Button,
  Table,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import MemberDisplay from './MemberDisplay';
import { getAuth, signOut } from 'firebase/auth';
import { onSnapshot } from 'firebase/firestore';
import { membersRef, usersRef } from '../../firebaseConfig';
import type { DocumentData } from 'firebase/firestore';
import { Member } from '../../types';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(1),
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(1, 0, 1),
  },
  table: {
    maxWidth: '100%',
    overflowX: 'auto',
    marginTop: theme.spacing(3),
    fontSize: '0.9rem',
  },
  subtitle1: {
    fontSize: '1rem',
  },
}));
const HomePage = () => {
  const classes = useStyles();
  const auth = getAuth();
  const [user, setUser] = useState<DocumentData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [members, setMembers] = useState<Member[]>([
    {
      id: '',
      firstName: '',
      lastName: '',
      dob: undefined,
      height: undefined,
      weight: undefined,
      goals: '',
      memberNotes: '',
      movementsScreen: [],
      history: [],
    },
  ]);
  const navigate = useNavigate();

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(`Searching for: ${searchTerm}`);
  };

  const handleAddMember = () => {
    navigate('/add-member');
  };

  const filteredMembers = members.filter((member) => {
    const memberName = `${member.firstName} ${member.lastName}`;
    return memberName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(membersRef, (querySnapshot) => {
      const members: Member[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data) {
          members.push({
            id: doc.id,
            firstName: data.firstName,
            lastName: data.lastName,
            dob: data.dob,
            height: data.height,
            weight: data.weight,
            goals: data.goals,
            memberNotes: data.memberNotes,
            movementsScreen: data.movementsScreen || [],
            history: data.history || [],
          });
        }
      });
      setMembers(members);
    });
    const unsubscribeUser = onSnapshot(usersRef, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData) {
          setUser(userData);
        }
      });
    });
    return () => unsubscribe();
    unsubscribeUser();
  }, []);

  return (
    <Container className={classes.root}>
      <Typography variant="h5">Member Management</Typography>
      {user && user.firstName && user.lastName && (
        <Typography variant="h3">
          Welcome {user.firstName} {user.lastName}
        </Typography>
      )}
      <form className={classes.form} onSubmit={handleSearch}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <TextField
            label="Search for Member By Name"
            variant="outlined"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            fullWidth
            margin="normal"
          />
        </div>
      </form>
      <div
        style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}
      >
        <Button
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={handleAddMember}
        >
          Add New Member
        </Button>
      </div>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>Height</TableCell>
            <TableCell>Weight (lbs)</TableCell>
            <TableCell>Goals</TableCell>
            <TableCell>Notes</TableCell>
            <TableCell>Member Screen</TableCell>
            <TableCell>Member History</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredMembers.map((member) => (
            <TableRow key={member.id}>
              <MemberDisplay member={member} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        variant="contained"
        color="secondary"
        className={classes.submit}
        onClick={() => signOut(auth)}
      >
        Sign Out
      </Button>
    </Container>
  );
};

export default HomePage;
