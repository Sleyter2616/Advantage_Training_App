import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  Checkbox,
} from '@material-ui/core';
import {
  onSnapshot,
  updateDoc,
  doc,
  DocumentReference,
} from 'firebase/firestore';
import { membersRef } from '../../firebaseConfig';
import { History, Member } from '../../types';
import Header from '../../components/Header';
import MovementScreenDisplay from './MovementScreenDisplay';
import CustomPagination from './CustomPagination';
import DeleteDialog from './DeleteDialog';
import { MenuItem, Select } from "@material-ui/core";

interface HistoryParams extends Record<string, string | undefined> {
  memberId: string;
}

const buttonStyle = {
  margin: '12px',
};

const ROWS_PER_PAGE = 5;
const programWeekOptions = Array.from(Array(54).keys()).map((week) => ({
  value: `${week}`,
  label: `Week ${week}`,
}));
const dateNotesCellStyle = {
  minWidth: '150px',
};
const ViewHistoryPage = () => {
  const [disableSaveButton, setDisableSaveButton] = useState(true);

  const [addingNewRow, setAddingNewRow] = useState(false);
  const { memberId } = useParams<HistoryParams>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const memberRef: DocumentReference = doc(membersRef, memberId);
  const [member, setMember] = useState<Member | null>(null);
  const [history, setHistory] = useState<Array<History>>([]);
  const [newHistoryData, setNewHistoryData] = useState<History>({
    id: uuidv4(),
    date: new Date(),
    dateNotes: '',
    programWeek: '1',
    programDay: '',
    completed: false,
  });
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [editedHistory, setEditedHistory] = useState<History>({
    id: '',
    date: new Date(),
    dateNotes: '',
    programWeek: '1',
    programDay: '',
    completed: false,
  });
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const unsubscribe = onSnapshot(memberRef, (doc) => {
      const memberData = doc.data() as Member;
      const historyData = memberData.history;
      setMember(memberData);
      setHistory(
        historyData.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );
    });
    return () => {
      unsubscribe();
    };
  }, [memberId]);

  const handleEdit = (index: number, history: History) => {
    setEditingRowIndex(index);
    setEditedHistory(history);
  };
  const handleSave = async (index: number) => {
    try {
      const updatedHistory = { ...editedHistory };

      const updatedDate = new Date(updatedHistory.date);
      console.log(updatedDate);
      if (!updatedHistory.date || isNaN(updatedDate.getTime())) {
        alert('Please enter a valid date.');
        return;
      }
      const updatedHistoryList = [...history];
      updatedHistoryList[index] = updatedHistory;
      await updateDoc(memberRef, {
        history: updatedHistoryList,
      });
      setEditingRowIndex(null);
    } catch (error) {
      console.error('Error updating history:', error);
    }
  };

  const handleCancel = () => {
    setEditingRowIndex(null);
    setEditedHistory({
      id: '',
      date: new Date(),
      dateNotes: '',
      programWeek: '1',
      programDay: '',
      completed: false,
    });
  };

  const handleAddNewRowClick = () => {
    setAddingNewRow(true);
  };

  const handleCancelAddNewRow = () => {
    setAddingNewRow(false);
    setNewHistoryData({
      id: uuidv4(),
      date: new Date(),
      dateNotes: '',
      programWeek: '1',
      programDay: '',
      completed: false,
    });
  };

  const handleAddNewRow = async () => {
    try {
      const newId = Date.now().toString();
      const newHistory: History = {
        id: newId,
        date: newHistoryData.date,
        dateNotes: newHistoryData.dateNotes,
        programWeek: newHistoryData.programWeek,
        programDay: newHistoryData.programDay,
        completed: newHistoryData.completed,
      };
      await updateDoc(memberRef, {
        history: [...history, newHistory],
      });
      setAddingNewRow(false);
      setDisableSaveButton(true);
      const date = new Date();

      const month = date.getMonth() + 1; //months from 1-12
      const day = date.getDate();
      const year = date.getFullYear();
      setNewHistoryData({
        id: uuidv4(),
        date: new Date(year, month, day),
        dateNotes: '',
        programWeek: '1',
        programDay: '',
        completed: false,
      });
    } catch (error) {
      console.error('Error adding history item:', error);
    }
  };

  const handleNewRowChange = (name: string) => (
    event: React.ChangeEvent<{ name?: string; value: unknown } >
  ) => {
    const isCheckbox = name === 'completed';
    const value = isCheckbox 
      ? (event.target as HTMLInputElement).checked 
      : event.target.value;

      setNewHistoryData({ ...newHistoryData, [name]: value });
      if (name === 'date') {
        setDisableSaveButton(
          !value || isNaN(new Date(value as string).getTime())
        );
      }
    };
    const handleEditChange = (name: string) => (
      event: React.ChangeEvent<{ name?: string; value: unknown }>
    ) => {
      const isCheckbox = name === 'completed';
      const value = isCheckbox 
        ? (event.target as HTMLInputElement).checked 
        : event.target.value;
      setEditedHistory({ ...editedHistory, [name]: value });
    };

  const handleDeleteClick = (index: number) => {
    setDeletingIndex(index);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const updatedHistoryList = [...history];
      updatedHistoryList.splice(deletingIndex as number, 1);
      await updateDoc(memberRef, {
        history: updatedHistoryList,
      });
      setDeleteDialogOpen(false);
      setDeletingIndex(null);
    } catch (error) {
      console.error('Error deleting history:', error);
    }
  };

  const offset = (currentPage - 1) * ROWS_PER_PAGE;
  const pageCount = Math.ceil(history.length / ROWS_PER_PAGE);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Header />
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        name="Row"
        onDelete={handleDeleteConfirm}
      />
      <Typography variant="h3" align="center">
        History for {member?.firstName} {member?.lastName}
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Program Week</TableCell>
            <TableCell>Program Day</TableCell>
            <TableCell>Completed</TableCell>
            <TableCell>Date Notes</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {history.slice(offset, offset + ROWS_PER_PAGE).map((h, index) => (
            <TableRow key={h.id}>
              <TableCell>
                {editingRowIndex === index ? (
                  <TextField
                    variant="outlined"
                    type="date"
                    fullWidth
                    value={editedHistory.date}
                    onChange={handleEditChange('date')}
                  />
                ) : (
                  new Date(
                    new Date(h.date).toISOString().slice(0, -1)
                  ).toLocaleDateString()
                )}
              </TableCell>
              <TableCell>
                {editingRowIndex === index ? (

                   <Select
                     variant="outlined"
                     fullWidth
                     value={editedHistory.programWeek}
                     onChange={handleEditChange('programWeek')} 
                   >
                     {programWeekOptions.map((option) => (
                       <MenuItem key={option.value} value={option.value}>
                         {option.label}
                       </MenuItem>
                     ))}
                   </Select>
                ) : (
                  h.programWeek
                )}
                </TableCell>
              <TableCell>
                {editingRowIndex === index ? (
                  <TextField
                    variant="outlined"
                    fullWidth
                    value={editedHistory.programDay}
                    onChange={handleEditChange('programDay')}
                  />
                ) : (
                  h.programDay
                )}
              </TableCell>
              <TableCell>
                {editingRowIndex === index ? (
                  <Checkbox
                    checked={editedHistory.completed}
                    color="primary"
                    onChange={handleEditChange('completed')}
                  />
                ) : (
                  <Checkbox checked={h.completed} color="primary" disabled />
                )}
              </TableCell>
              <TableCell style={dateNotesCellStyle}>
                {editingRowIndex === index ? (
                  <TextField
                    variant="outlined"
                    fullWidth
                    value={editedHistory.dateNotes}
                    onChange={handleEditChange('dateNotes')}
                  />
                ) : (
                  h.dateNotes
                )}
              </TableCell>
              <TableCell align="center">
                {editingRowIndex !== index ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEdit(index, h)}
                    style={buttonStyle}
                  >
                    Edit
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleSave(index)}
                      style={buttonStyle}
                    >
                      Save
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleCancel}
                      style={buttonStyle}
                    >
                      Cancel
                    </Button>
                  </>
                )}
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDeleteClick(index)}
                  style={buttonStyle}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {addingNewRow &&
            (console.log(
              new Date(newHistoryData.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })
            ),
            (
              <TableRow>
                <TableCell>
                  <TextField
                    variant="outlined"
                    type="date"
                    fullWidth
                    value={newHistoryData.date}
                    onChange={handleNewRowChange('date')}
                  />
                </TableCell>
                
                <TableCell>
  <Select
    variant="outlined"
    fullWidth
    value={newHistoryData.programWeek}
    onChange={handleNewRowChange('programWeek')}
  >
    {programWeekOptions.map((option) => (
      <MenuItem key={option.value} value={option.value}>
        {option.label}
      </MenuItem>
    ))}
  </Select>
</TableCell>
                <TableCell>
                  <TextField
                    variant="outlined"
                    fullWidth
                    value={newHistoryData.programDay}
                    onChange={handleNewRowChange('programDay')}
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={newHistoryData.completed}
                    color="secondary"
                    onChange={handleNewRowChange('completed')}
                  />
                </TableCell>
                <TableCell style={dateNotesCellStyle}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    value={newHistoryData.dateNotes}
                    onChange={handleNewRowChange('dateNotes')}
                  />
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddNewRow}
                    style={buttonStyle}
                    disabled={disableSaveButton}
                  >
                    Save
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleCancelAddNewRow}
                    style={buttonStyle}
                  >
                    Cancel
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <CustomPagination
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          pageCount={pageCount}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {!addingNewRow && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddNewRowClick}
            style={buttonStyle}
          >
            Add New Row
          </Button>
        )}
      </div>
      {member?.movementsScreen && <MovementScreenDisplay member={member} />}
    </>
  );
};
export default ViewHistoryPage;
