import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const ViewMedication = () => {
  const { selectedTime } = useParams();
  const medications = useSelector((state: any) => state.medications.data);
  const targetMedication = medications.find((item: any) => item.inputTime == selectedTime);

  return targetMedication ? (
    <div className="d-flex flex-column align-items-center justify-content-center">
      <div className="d-flex flex-row w-100">
        <div className="m-3">
          <h5>Category</h5>
          {targetMedication.categoryName}
        </div>
        <div className="m-3">
          <h5>Time</h5>
          {`${new Date(targetMedication.inputTime).toLocaleDateString()}  --
            ${new Date(targetMedication.inputTime).toLocaleTimeString()}`}
        </div>
      </div>
      <div className="d-flex flex-column m-3">
        <div>
          <h5>Content :</h5>
          <h4>{targetMedication.inputContent}</h4>
        </div>
        <div className="mt-4">
          <h5>Medication :</h5>
          <h4>{targetMedication.productName}</h4>
        </div>
      </div>
    </div>
  ) : null;
};

export default ViewMedication;
