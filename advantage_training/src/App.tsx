import React,{useState} from 'react';
import {Route,  Routes, useNavigate} from 'react-router-dom'
import './App.css';
import LoginPage from './LoginPage';
import Home from './Home'
import AddClientPage from './Client/AddClientPage';
import AddProgram from './Client/AddProgram';
import Programs from './Client/Programs'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');


  return (
    <div>
       {isLoggedIn  ?
       (
      <Routes>
        <Route path="/" element={<LoginPage onLogin={() => setIsLoggedIn(true)} />} />
        <Route  path="/home" element={<Home />} />
        <Route path="/add-client" element={<AddClientPage clients={[]} onAddClient={(client) => console.log(client)} />} />
        <Route path="/clients/:id/add-program/:name" element={<AddProgram onAddTrainingProgram={(trainingProgram) => console.log(trainingProgram)} />} />
        <Route  path="/clients/:clientId/programs" element={<Programs />} />
       </Routes>
      ):(
      <Routes>
     <Route path="/" element={<LoginPage onLogin={() => setIsLoggedIn(true)} />} />
    </Routes>
    )}
    </div>
  );
}

export default App;
