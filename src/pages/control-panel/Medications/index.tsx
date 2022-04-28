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
import { Bed } from '../../../types/Core.types';

const index = () => {
  const bed: Bed = useSelector((state: any) => state.patient.bed);
  const dispatch = useDispatch();

  const loadMedications = async () => {
    try {
      console.log('Bed asdsad', bed);
      const medications: any = await fetchMedications({
        patientId: String(bed.patientID),
        deviceId: '123',
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
      <Route path="/show/:medicationId" element={<ViewMedication />} />
    </Routes>
  );
};

export default index;
