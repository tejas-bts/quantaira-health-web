import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AddMedication from './AddMedication';
import ShowMedication from './ShowMedication';
import ViewMedication from './ViewMedication';

import { fetchMedications } from '../../../services/medications.services';
import { useDispatch, useSelector } from 'react-redux';
import { addToMedications } from '../../../reducers/medications';
import { toast } from 'react-toastify';
import MultiLingualLabel from '../../../components/core/MultiLingualLabel';

const index = () => {
  const bed: any = useSelector((state: any) => state.patient.bed);
  const dispatch = useDispatch();

  const loadMedications = async () => {
    try {
      const medications: any = await fetchMedications({
        pid: bed.patientId,
        device: '123',
      });
      dispatch(addToMedications({ medications }));
    } catch (e) {
      toast(<MultiLingualLabel id="ERROR_FETCHING_MEDICATIONS" />);
    }
  };

  useEffect(() => {
    loadMedications();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<ShowMedication />} />
      <Route path="/add/*" element={<AddMedication onUpdate={loadMedications} />} />
      <Route path="/add/:selectedTime" element={<AddMedication onUpdate={loadMedications} />} />
      <Route path="/view/:selectedTime" element={<ViewMedication />} />
    </Routes>
  );
};

export default index;
