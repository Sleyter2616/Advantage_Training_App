import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Divider,
  Box,
  TextField
} from "@material-ui/core";
import { Link } from "react-router-dom";

import { History, Member } from "../../types";
import Header from "../../components/Header";
import { membersRef } from "../../firebaseConfig";
import { doc, onSnapshot, updateDoc, DocumentReference } from "firebase/firestore";

interface HistoryParams extends Record<string, string | undefined> {
  memberId: string;
}

const buttonStyle = {
  margin: "12px",
};

const ViewHistoryPage = () => {
  const [expanded, setExpanded] = useState(false);
  const [addingNewRow, setAddingNewRow] = useState(false);
  const [editingId, setEditingId] = useState("");
  const { memberId } = useParams<HistoryParams>();

  const memberRef: DocumentReference = doc(membersRef, memberId);
  const [member, setMember] = useState<Member | null>(null);
  const [history, setHistory] = useState<Array<History>>([]);
  const [newHistoryData, setNewHistoryData] = useState<History >({
    id: uuidv4(),
    date: new Date(),
    dateNotes: "",
    programDay:'',
    completed: false,
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(memberRef, (doc) => {
      const memberData = doc.data() as Member;
      const historyData = memberData.history;
      setMember(memberData);
      setHistory(historyData);
    });
    return () => {
      unsubscribe();
    };
  }, [memberId]);

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleSave = async () => {
    const updatedHistory = history.find((h) => h.id === editingId);
    if (updatedHistory) {
      try {
        await updateDoc(memberRef, {
          history: history.map((h) => (h.id === editingId ? updatedHistory : h))
        });
        setEditingId("");
      } catch (error) {
        console.error("Error updating history:", error);
      }
    }
  };

  const handleCancel = () => {
    setEditingId("");
  };

  const handleAddNewRowClick = () => {
    setAddingNewRow(true);
    setExpanded(true);
  };

  const handleCancelAddNewRow = () => {
    setAddingNewRow(false);
    setExpanded(false);
    setNewHistoryData({
        id: uuidv4(),
        date: new Date(),
        dateNotes: "",
        programDay:'',
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
        programDay:newHistoryData.programDay,
        completed: newHistoryData.completed,
      };
      await updateDoc(memberRef, {
        history: [...history, newHistory]
      });
      setAddingNewRow(false);
      setExpanded(false);
      setNewHistoryData({
        id: uuidv4(),
        date: new Date(),
        dateNotes: "",
        programDay:'',
        completed: false,
      });
    } catch (error) {
      console.error("Error adding history item:", error);
    }
  };
  const handleNewRowChange = (field: keyof History) => (
    event: React.ChangeEvent<HTMLInputElement>
    ) => {
    setNewHistoryData({
    ...newHistoryData,
    [field]: event.target.value
    });
    };
    
    return (
    <>
    <Header />
    <Typography variant="h3" align="center">
    History for {member?.firstName} {member?.lastName}
    </Typography>
    <Table>
    <TableHead>
    <TableRow>
    <TableCell>Date</TableCell>
    <TableCell>Date Notes</TableCell>
    <TableCell>Completed</TableCell>
    <TableCell align="center">Actions</TableCell>
    </TableRow>
    </TableHead>
    <TableBody>
    {history.map((h) => (
    <TableRow key={h.id}>
    <TableCell>{new Date(h.date).toDateString()}</TableCell>
    <TableCell>{h.dateNotes}</TableCell>
    <TableCell>{h.completed}</TableCell>
    <TableCell align="center">
    {editingId !== h.id ? (
    <Button
    variant="contained"
    color="primary"
    style={buttonStyle}
    onClick={() => handleEdit(h.id)}
    >
    Edit
    </Button>
    ) : (
    <>
    <Button
                       variant="contained"
                       color="primary"
                       style={buttonStyle}
                       onClick={handleSave}
                     >
    Save
    </Button>
    <Button
                       variant="contained"
                       color="secondary"
                       style={buttonStyle}
                       onClick={handleCancel}
                     >
    Cancel
    </Button>
    </>
    )}
    </TableCell>
    </TableRow>
    ))}
    {addingNewRow &&  newHistoryData &&(
    <TableRow>
    <TableCell>
    <TextField
    variant="outlined"
    type="date"
    fullWidth
    value={newHistoryData.date}
    onChange={handleNewRowChange("date")}
    />
    </TableCell>
    <TableCell>
    <TextField
    variant="outlined"
    fullWidth
    value={newHistoryData.dateNotes}
    onChange={handleNewRowChange("dateNotes")}
    />
    </TableCell>
    <TableCell>
    <TextField
    variant="outlined"
    fullWidth
    value={newHistoryData.completed}
    onChange={handleNewRowChange("completed")}
    />
    </TableCell>
    <TableCell align="center">
    <Button
                   variant="contained"
                   color="primary"
                   style={buttonStyle}
                   onClick={handleAddNewRow}
                 >
    Save
    </Button>
    <Button
                   variant="contained"
                   color="secondary"
                   style={buttonStyle}
                   onClick={handleCancelAddNewRow}
                 >
    Cancel
    </Button>
    </TableCell>
    </TableRow>
    )}
    {!editingId && (
    <TableRow>
    <TableCell colSpan={4} align="center">
    <Button
                   variant="contained"
                   color="primary"
                   style={buttonStyle}
                   onClick={handleAddNewRowClick}
                 >
    Add New Row
    </Button>
    </TableCell>
    </TableRow>
    )}
    </TableBody>
    </Table>
    </>
    );
    };
    export default ViewHistoryPage;
