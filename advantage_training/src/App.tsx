import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import AddClientPage from './pages/AddClientPage';
import AddProgramPage from './pages/AddProgramPage';
import ViewProgramsPage from './pages/Programs/ViewProgramsPage';
import EditProgramPage from './pages/Programs/EditProgramPage';
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
          <Route path="/home" element={<HomePage />} />
          <Route path="/add-client" element={<AddClientPage onAddClient={(client) => console.log(client)} />} />
          <Route path="/client/:id/add-program" element={<AddProgramPage onAddTrainingProgram={(trainingProgram) => console.log(trainingProgram)} />} />
          <Route path="/client/:clientId/programs" element={<ViewProgramsPage />} />
          <Route path="/client/:clientId/edit-program/:programId" element={<EditProgramPage />} />
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
