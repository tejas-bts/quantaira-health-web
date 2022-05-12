import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { fetchNotes } from '../../../services/notes.services';
import { useDispatch, useSelector } from 'react-redux';
import { addToNotes } from '../../../reducers/notes';
import AddNote from './AddNote';
import ShowNotes from './ShowNotes';
import ViewNote from './ViewNote';
import { toast } from 'react-toastify';
import MultiLingualLabel from '../../../components/core/MultiLingualLabel';
import { Bed, Note } from '../../../types/Core.types';

const index = () => {
  const bed: Bed = useSelector((state: any) => state.patient.bed);
  const dispatch = useDispatch();

  const loadNotes = async () => {
    try {
      const notes: Array<Note> | undefined = await fetchNotes({
        patientId: String(bed.patientID),
        deviceId: '123',
      });

      dispatch(addToNotes({ notes }));
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
      <Route path="/view/:selectedTime" element={<ViewNote />} />
    </Routes>
  );
};

export default index;
