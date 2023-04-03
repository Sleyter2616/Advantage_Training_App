import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Member } from '../../types';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, Typography } from '@material-ui/core';
import { db } from '../../firebaseConfig';
import Header from '../../components/Header';
import type { DocumentData } from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';
import { usersRef } from '../../firebaseConfig';
import DeleteDialog from './DeleteDialog';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
  },
  textField: {
    width: '100%',
    marginBottom: '1rem',
  },
  button: {
    marginTop: '1rem',
    color: '#fff',
    '&:hover': {
      background: '#303f9f',
    },
  },
});

const EditMemberInfo: React.FC = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const classes = useStyles();
  const [user, setUser] = useState<DocumentData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [member, setMember] = useState<Member | null>(null);

  useEffect(() => {
    const fetchMember = async () => {
      if (memberId) {
        const memberDoc = await getDoc(doc(db, 'members', memberId));
        setMember(memberDoc.data() as Member);
      }
    };
    fetchMember();
  }, [memberId]);
  const handleDeleteMember = () => {
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async (values: Member) => {
    if (memberId) {
      await updateDoc(doc(db, 'members', memberId), {
        goals: values.goals,
        memberNotes: values.memberNotes,
        weight: values.weight,
      });
    }
    navigate(`/home`);
  };

  const validationSchema = Yup.object({
    goals: Yup.string().required('Required'),
    memberNotes: Yup.string().notRequired(),
    weight: Yup.number().required('Required'),
  });
  const handleDeleteConfirm = async () => {
    if (user && user.canDelete && memberId) {
      await deleteDoc(doc(db, 'members', memberId));
      navigate('/home');
    } else {
      // Optionally, display a message to the user if they don't have permission to delete members
      alert('You do not have permission to delete members.');
    }
  };

  useEffect(() => {
    const unsubscribeUser = onSnapshot(usersRef, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData) {
          setUser(userData);
        }
      });
    });
    return;
    unsubscribeUser();
  }, []);

  return (
    <div>
      <Header />
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={handleDeleteConfirm}
        name="member"
      />

      <Typography variant="h4" component="h1" align="center">
        Edit Member Info for "{member?.firstName} {member?.lastName}""
      </Typography>
      {member && memberId ? (
        <Formik
          initialValues={{
            id: member.id,
            firstName: member.firstName,
            lastName: member.lastName,
            dob: member.dob,
            height: member.height,
            weight: member.weight,
            goals: member.goals,
            memberNotes: member.memberNotes,
            movementsScreen: member.movementsScreen,
            history: member.history,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleBlur, errors, touched }) => (
            <Form className={classes.form}>
              <TextField
                className={classes.textField}
                id="goals"
                label="Goals (Required)"
                name="goals"
                value={values.goals}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.goals && Boolean(errors.goals)}
                helperText={touched.goals && errors.goals}
              />
              <TextField
                className={classes.textField}
                id="memberNotes"
                label="Member Notes (Optional)"
                name="memberNotes"
                value={values.memberNotes}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.memberNotes && Boolean(errors.memberNotes)}
                helperText={touched.memberNotes && errors.memberNotes}
              />
              <TextField
                className={classes.textField}
                id="weight"
                label="Weight (lbs) (Required)"
                name="weight"
                type="number"
                value={values.weight}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.weight && Boolean(errors.weight)}
                helperText={touched.weight && errors.weight}
              />
              <Button
                className={classes.button}
                type="submit"
                variant="contained"
                color="primary"
              >
                Update Member Info
              </Button>
              <Button
                className={classes.button}
                type="button"
                variant="contained"
                color="secondary"
                onClick={handleDeleteMember}
                disabled={!user || !user.canDelete}
              >
                Delete Member
              </Button>
            </Form>
          )}
        </Formik>
      ) : (
        <Typography variant="h6" component="h2" align="center">
          Loading member data...
        </Typography>
      )}
    </div>
  );
};

export default EditMemberInfo;
