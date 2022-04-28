import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Medication } from '../../../types/Core.types';

const ViewMedication = () => {
  const { selectedTime } = useParams();
  const [targetMedication, setMedication] = useState<Medication | undefined>(undefined);

  const medications = useSelector((state: any) => state.medications.data);

  useEffect(() => {
    if (selectedTime !== undefined && medications !== undefined) {
      const targetMedication = medications.find((item: any) => item.inputTime == selectedTime);
      setMedication(targetMedication);
    }
  }, []);

  return targetMedication !== undefined ? (
    <div className="d-flex flex-column align-items-center justify-content-center">
      <div className="d-flex flex-row w-100">
        <div className="m-3">
          <h5>Category</h5>
          {targetMedication.author.role}
        </div>
        <div className="m-3">
          <h5>Time</h5>
          {`${new Date(targetMedication.timeStamp).toLocaleDateString()}  --
            ${new Date(targetMedication.timeStamp).toLocaleTimeString()}`}
        </div>
      </div>
      <div className="d-flex flex-column m-3">
        <div>
          <h5>Content :</h5>
          <h4>{targetMedication.note}</h4>
        </div>
        <div className="mt-4">
          <h5>Medication :</h5>
          <h4>{targetMedication.product.name}</h4>
        </div>
        <div className="mt-4">
          <h5>Added by :</h5>
          <h4>{targetMedication.author.name}</h4>
        </div>
      </div>
    </div>
  ) : null;
};

export default ViewMedication;
