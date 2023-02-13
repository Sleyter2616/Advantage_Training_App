import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Typography, TableHead, TextField, Button, Table, TableRow, TableCell, TableBody } from '@material-ui/core';
import { useNavigate, Link } from 'react-router-dom';
import ClientPage from './ClientPage';
import { Client } from './Client/types';



const evalSheetData = {
  name: 'John Doe',
  age: 28,
  goals: 'Lose weight and build muscle',
  notes: 'No injuries or health issues',
  movements: [
    {
      name: 'Squat',
      weight: '200',
      sets: '3',
      reps: '8'
    },
    {
      name: 'Deadlift',
      weight: '225',
      sets: '3',
      reps: '6'
    },
    {
      name: 'Bench Press',
      weight: '155',
      sets: '3',
      reps: '10'
    },
    {
      name: 'Pull-up',
      weight: '0',
      sets: '3',
      reps: '6'
    }
  ],
  notesHistory: [
    {
      date: '2022-02-10',
      notes: 'Client was feeling fatigued during workout'
    },
    {
      date: '2022-02-07',
      notes: 'Client was able to complete all sets and reps'
    }
  ]
};

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
    movements: evalSheetData.movements,
    notesHistory: evalSheetData.notesHistory,
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

  const handleNewClientChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewClient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewClientSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newClientId = clients.length + 1;
    const newClientWithId = {
      ...newClient,
      id: newClientId.toString(),
      height: Number(newClient.height).toString(), // convert the height value to string
      weight: Number(newClient.weight).toString(), // convert the weight value to string
    };
    setClients((prev) => [...prev, newClientWithId]);
    navigate(`/clients/${newClientId}`);
  };

  const filteredClients = clients.filter((client) => {
    return client.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
  <Container className={classes.root}>
    <Typography variant="h5">Client Management</Typography>
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
          <TableCell>Program</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
  {filteredClients.map((client) => (
    <TableRow key={client.id}>
      <ClientPage client={client} />
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
