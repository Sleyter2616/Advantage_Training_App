import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
// import AddClientPage from './pages/OldPages/AddClientPage';
// import AddProgramPage from './pages/OldPages/AddProgramPage';
// import ViewProgramsPage from './pages/OldPages/ViewProgramsPage';
// import EditProgramPage from './pages/Programs/EditProgramPage';
import AddMemberPage from './pages/NewComponents/AddMemberPage';
import AddMovementScreenPage from './pages/NewComponents/AddMovementScreen';
import { getAuth } from 'firebase/auth';
import EditMovementScreen from './pages/NewComponents/EditMovementScreen';
import ViewHistoryPage from './pages/NewComponents/ViewHistory';
import EditMemberInfo from './pages/NewComponents/EditMemberInfo';
import { DocumentData } from 'firebase/firestore';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<DocumentData | null>(null);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUser(user);
      } else {
        setIsLoggedIn(false);
        setUser(null);
        navigate('/');
      }
    });
    return unsubscribe;
  }, [auth, navigate]);

  return (
    <div>
      {isLoggedIn ? (
        <Routes>
          <Route
            path="/"
            element={<LoginPage onLogin={() => setIsLoggedIn(true)} />}
          />
          <Route path="/home" element={<HomePage  userData={user}  />} />
          <Route
            path="/add-member"
            element={
              <AddMemberPage onAddMember={(member) => console.log(member)} />
            }
          />
          <Route
            path="/member/:id/add-movement-screen"
            element={<AddMovementScreenPage />}
          />
          <Route
            path="/member/:memberId/edit-movement-screen/"
            element={<EditMovementScreen />}
          />
          <Route
            path="member/:memberId/view-history/"
            element={<ViewHistoryPage />}
          />
          <Route
            path="/member/:memberId/edit-info"
            element={<EditMemberInfo />}
          />
          {/* 
          <Route path="/add-client" element={<AddClientPage onAddClient={(client) => console.log(client)} />} />
          <Route path="/client/:id/add-program" element={<AddProgramPage onAddTrainingProgram={(trainingProgram) => console.log(trainingProgram)} />} /> */}
          {/* <Route
            path="/client/:clientId/programs"
            element={<ViewProgramsPage />}
          />
          <Route
            path="/client/:clientId/edit-program/:programId"
            element={<EditProgramPage />}
          /> */}
        </Routes>
      ) : (
        <Routes>
          <Route
            path="/"
            element={<LoginPage onLogin={() => setIsLoggedIn(true)} />}
          />
        </Routes>
      )}
    </div>
  );
}

export default App;
