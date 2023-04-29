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
  TableContainer,
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import MemberDisplay from './MemberDisplay';
import { getAuth, signOut } from 'firebase/auth';
import { onSnapshot, query, where } from 'firebase/firestore';
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
  tableContainer: {
    maxWidth: '100%',
    overflowX: 'auto',
    marginTop: theme.spacing(3),
  },
  table: {
    width: '100%',
    overflowX: 'auto',
    marginTop: theme.spacing(3),
    fontSize: '0.9rem',
  },
  subtitle1: {
    fontSize: '1rem',
  },
}));
const HomePage = (userData:DocumentData ) => {
  console.log(userData,'user')
  const classes = useStyles();
  const auth = getAuth();
  const [user, setUser] = useState<DocumentData | null>(null)
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
    const membersUnsubscribe = onSnapshot(membersRef, (querySnapshot) => {
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

    return () => {
      membersUnsubscribe();

    };
  }, []);
  useEffect(() => {
    if (userData.userData && userData.userData.email) {
      const unsubscribe = onSnapshot(
        query(usersRef, where('email', '==', userData.userData.email)),
        (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const fullUserData = doc.data();
            setUser({
              ...user,
              firstName: fullUserData.firstName,
              lastName: fullUserData.lastName,
            });
          });
        }
      );
      return unsubscribe;
    }
  }, [userData]);
  
  

  return (
    <Container className={classes.root}>
      <Typography variant="h5" align='center'>Member Management</Typography>
      {user && user.firstName && user.lastName && (
        <Typography  align='center' variant="h3">
          {console.log( user.firstName ,user.lastName)}
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
      <TableContainer className={classes.tableContainer}>
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
            <TableCell>Edit Member</TableCell>
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
      </TableContainer>
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
