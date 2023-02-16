
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Typography, TableHead, TextField, Button, Table, TableRow, TableCell, TableBody } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import ClientDisplay from './ClientDisplay';
import { getAuth, signOut } from "firebase/auth";
import {  onSnapshot } from "firebase/firestore";
import { usersRef} from "../firebaseConfig";
import type { DocumentData } from "firebase/firestore";

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
  const [clients, setClients] = useState([
    { id: '1', name: 'John Doe', dob: '01/01/1990', height: '180', weight: '80', goals: 'Lose weight', notes: 'None',  },
    { id: '2', name: 'Jane Doe', dob: '02/02/1995', height: '170', weight: '70', goals: 'Build muscle', notes: 'Allergic to peanuts'  },
    { id: '3', name: 'Jim Smith', dob: '03/03/2000', height: '175', weight: '75', goals: 'Improve strength', notes: 'Has knee injury'},
  ]);
  const navigate = useNavigate();
  const [newClient, setNewClient] = useState({
    id: uuidv4(),
    name: '',
    dob: '',
    height: '',
    weight: '',
    goals: '',
    notes: '',
    movements: {},
    notesHistory: {}
  });

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(`Searching for: ${searchTerm}`);
  };

  const handleAddClient = () => {
    navigate('/add-client');
  };

  const filteredClients = clients.filter((client) => {
    return client.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(usersRef, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData) {
            setUser(userData);
        }
      });
    });
    return () => unsubscribe();
  }, []);
  return (
  <Container className={classes.root}>
    <Typography variant="h5">Client Management</Typography>
    {user && user.firstName && user.lastName &&(<Typography variant="h3">Welcome {user.firstName} {user.lastName}</Typography>)}
    <form className={classes.form} onSubmit={handleSearch}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <TextField
          label="Search for Client By Name"
          variant="outlined"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          fullWidth
          margin="normal"
        />
      </div>
    </form>
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
      <Button
        variant="contained"
        color="primary"
        className={classes.submit}
        onClick={handleAddClient}
      >
        Add New Client
      </Button>
    </div>
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Age</TableCell>
          <TableCell>Height</TableCell>
          <TableCell>Weight</TableCell>
          <TableCell>Goals</TableCell>
          <TableCell>Notes</TableCell>
          <TableCell>Programs</TableCell>
          <TableCell>Add New Program</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
  {filteredClients.map((client) => (
    <TableRow key={client.id}>
      <ClientDisplay client={client}  />
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

          }
          export default (HomePage)
