import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import AccordionInDropdown from '../../../components/core/AccordionInDropdown';
import { Medication } from '../../../types/Core.types';

const ViewMedication = () => {
  const { selectedTime } = useParams();
  const [targetMedications, setMedications] = useState<Array<Medication>>([]);

  const medications: Array<Medication> = useSelector((state: any) => state.medications.data);

  console.log('Medication Id', selectedTime, medications);

  useEffect(() => {
    if (selectedTime !== undefined && medications !== undefined) {
      const targetMedications = medications.filter(
        (item: Medication) => item.timeStamp == parseInt(selectedTime)
      );
      setMedications(targetMedications);
    }
  }, [selectedTime]);

  return targetMedications.length > 0 ? (
    <div className="show-notes-page">
      <div className="notes-page-header">
        {`Medications at ${new Date(
          parseInt(`${selectedTime}`) * 1000
        ).toLocaleDateString()} ${new Date(
          parseInt(`${selectedTime}`) * 1000
        ).toLocaleTimeString()}`}
      </div>
      <div className="notes-list">
        {medications.length > 0 && <AccordionInDropdown show={true} data={targetMedications} />}
      </div>
    </div>
  ) : null;
};

export default ViewMedication;
