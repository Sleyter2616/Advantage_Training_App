import React from 'react';
import {Route,  Routes, useNavigate} from 'react-router-dom'
import './App.css';
import LoginPage from './LoginPage';
import Home from './Home'
import AddClientPage from './Client/AddClientPage';

function App() {
  const navigate = useNavigate();
  return (
      <div>
      <Routes>
  <Route path="/" element={<LoginPage />} />
  <Route path="/home" element={<Home />} />
  <Route
    path="/add-client"
    element={<AddClientPage clients={[]} onAddClient={(client) => console.log(client)} />}
  />
</Routes>
      </div>
  );
}
export default App;
