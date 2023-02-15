
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Typography, TableHead, TextField, Button, Table, TableRow, TableCell, TableBody } from '@material-ui/core';
import { useNavigate, Link } from 'react-router-dom';
import ClientPage from './ClientPage';
import { Client } from './Client/types';
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, collection, onSnapshot } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebaseConfig";
import type { DocumentData } from "firebase/firestore";

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const usersRef = collection(db, 'users');

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

const HomePage = () => {
  const classes = useStyles();
  const auth = getAuth();
  const [user, setUser] = useState<DocumentData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState([
    { id: '1', name: 'John Doe', dob: '01/01/1990', height: '180', weight: '80', goals: 'Lose weight', notes: 'None', program: 'Weight Loss' },
    { id: '2', name: 'Jane Doe', dob: '02/02/1995', height: '170', weight: '70', goals: 'Build muscle', notes: 'Allergic to peanuts', program: 'Muscle Building' },
    { id: '3', name: 'Jim Smith', dob: '03/03/2000', height: '175', weight: '75', goals: 'Improve strength', notes: 'Has knee injury', program: 'Strength Training' },
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
    program: '',
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
  const handleAddProgram = (client: Client) => {
    navigate(`/clients/${client.id}/add-program/${client.name}`);

  };

  const filteredClients = clients.filter((client) => {
    return client.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // const auth = getAuth();
  // signOut(auth).then(() => {
  //   // Sign-out successful.
  // }).catch((error) => {
  //   // An error happened.
  // });
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
          label="Search for Client"
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
        Add Client
      </Button>
    </div>
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Date of Birth</TableCell>
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
      <ClientPage client={client}  />
      <TableCell>
        <Button
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={() => handleAddProgram(client)}
        >
          Add Program for {client.name}
        </Button>
      </TableCell>
    </TableRow>
  ))}
</TableBody>
    </Table>
  </Container>
);

          }
          export default (HomePage)
