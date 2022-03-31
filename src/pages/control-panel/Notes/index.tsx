import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { fetchNotes } from '../../../services/notes.services';
import { fetchMedications } from '../../../services/medications.services';
import { useDispatch, useSelector } from 'react-redux';
import { addToNotes } from '../../../reducers/notes';
import { addToMedications } from '../../../reducers/medications';
import AddNote from './AddNote';
import ShowNotes from './ShowNotes';
import ViewNote from './ViewNote';
import { toast } from 'react-toastify';
import MultiLingualLabel from '../../../components/core/MultiLingualLabel';

const index = () => {
  const bed: any = useSelector((state: any) => state.patient.bed);
  const dispatch = useDispatch();

  const loadNotes = async () => {
    try {
      const notes: any = await fetchNotes({
        pid: bed.patientId,
        device: '123',
      });
      const medications: any = await fetchMedications({
        pid: bed.patientId,
        device: '123',
      });

      dispatch(addToNotes({ notes }));
      dispatch(addToMedications({ medications }));
    } catch (e) {
      toast(<MultiLingualLabel id="ERROR_FETCHING_NOTES" />);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<ShowNotes />} />
      <Route path="/add/*" element={<AddNote onUpdate={loadNotes} />} />
      <Route path="/add/:selectedTime" element={<AddNote onUpdate={loadNotes} />} />
      <Route path="/view/:noteId" element={<ViewNote />} />
    </Routes>
  );
};

export default index;
