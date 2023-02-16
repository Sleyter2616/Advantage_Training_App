import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import Home from './Home';
import AddClientPage from './Client/AddClientPage';
import AddProgram from './Client/AddProgram';
import Programs from './Client/Programs';
import { getAuth } from 'firebase/auth';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        navigate('/');
      }
    });
    return unsubscribe;
  }, [auth, navigate]);

  return (
    <div>
      {isLoggedIn ? (
        <Routes>
          <Route path="/" element={<LoginPage onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/home" element={<Home />} />
          <Route path="/add-client" element={<AddClientPage onAddClient={(client) => console.log(client)} />} />
          <Route path="/client/:id/add-program" element={<AddProgram onAddTrainingProgram={(trainingProgram) => console.log(trainingProgram)} />} />
          <Route path="/client/:clientId/programs" element={<Programs />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<LoginPage onLogin={() => setIsLoggedIn(true)} />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
