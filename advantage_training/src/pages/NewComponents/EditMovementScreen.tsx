import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@material-ui/core';

import { MovementScreen } from '../../types';
import Header from '../../components/Header';
import { membersRef } from '../../firebaseConfig';
import { getDoc, doc, updateDoc, DocumentReference } from 'firebase/firestore';
const buttonStyle = {
  margin: '12px',
};
interface EditMovementScreenProps extends Record<string, string | undefined> {
  memberId: string;
  // screenId: string;
}

const EditMovementScreen = () => {
  const { memberId } = useParams<EditMovementScreenProps>();
  const [movementScreen, setMovementScreen] = useState<MovementScreen[]>([]);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const memberRef: DocumentReference = doc(membersRef, memberId);
      const memberSnapshot = await getDoc(memberRef);
      if (memberSnapshot.exists()) {
        const updatedMovementScreens = movementScreen.map((screen) => ({
          id: screen.id,
          movementName: screen.movementName,
          movementLevel: screen.movementLevel,
        }));
        await updateDoc(memberRef, { movementsScreen: updatedMovementScreens });
        navigate(`/member/${memberId}/view-history`);
      } else {
        setError('Member not found');
      }
    } catch (error) {
      console.error('Error updating movement screen:', error);
      setError('Error updating movement screen');
    }
  };

  useEffect(() => {
    const getMemberScreen = async () => {
      const memberRef: DocumentReference = doc(membersRef, memberId);
      const memberSnapshot = await getDoc(memberRef);

      if (memberSnapshot.exists()) {
        const memberData = memberSnapshot.data();
        console.log('memberData', memberData.movementsScreen);
        const movementScreenData: MovementScreen[] = Object.values(
          memberData?.movementsScreen || {}
        );

        if (movementScreenData) {
          console.log('movementScreenData', movementScreenData);
          setMovementScreen(movementScreenData);
        } else {
          console.log('Program not found');
        }
      } else {
        console.log('Client not found');
      }
    };
    getMemberScreen();
  }, [memberId]);

  return (
    <>
      <Header />
      <Typography variant="h6" align="center">
        Edit Movement Screen
      </Typography>
      {error && (
        <Typography variant="h6" align="center">
          {error}
        </Typography>
      )}
      {movementScreen && (
        <Box display="flex" justifyContent="center">
          <form onSubmit={handleUpdate}>
            {movementScreen.map((screen) => (
              <Box
                key={screen.id}
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <TextField
                  variant="outlined"
                  label={screen.movementName}
                  margin="normal"
                  fullWidth
                  value={screen.movementName}
                  onChange={(event) =>
                    setMovementScreen((prev) =>
                      prev.map((item) =>
                        item.id === screen.id
                          ? { ...item, movementName: event.target.value }
                          : item
                      )
                    )
                  }
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Movement Level</InputLabel>
                  <Select
                    label="Movement Level"
                    value={screen.movementLevel}
                    onChange={(event) =>
                      setMovementScreen((prev) =>
                        prev.map((item) =>
                          item.id === screen.id
                            ? {
                                ...item,
                                movementLevel: event.target.value as
                                  | 'Green'
                                  | 'Yellow'
                                  | 'Red',
                              }
                            : item
                        )
                      )
                    }
                  >
                    <MenuItem value="Green">Green</MenuItem>
                    <MenuItem value="Yellow">Yellow</MenuItem>
                    <MenuItem value="Red">Red</MenuItem>
                  </Select>
                </FormControl>

                <Box display="flex" justifyContent="center" mt={2}></Box>
              </Box>
            ))}
            <Button
              variant="contained"
              color="primary"
              type="submit"
              style={buttonStyle}
            >
              Update
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate(`/member/${memberId}/view-history`)}
              style={buttonStyle}
            >
              Cancel
            </Button>
          </form>
        </Box>
      )}
    </>
  );
};

export default EditMovementScreen;
