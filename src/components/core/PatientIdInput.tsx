import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchPatientData } from '../../services/patient.services';
import { Bed } from '../../types/Core.types';

const PatientIdInput = ({ value, ...props }: { value?: string | number }) => {
  const [isDisabled, setDisabled] = useState(true);
  const [isCardShown, setCardShown] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [patient, setPatient] = useState<any>({});
  const inputRef = useRef<HTMLInputElement>(null);

  const bed: Bed = useSelector((state: any) => state.patient.bed);

  const loadPatientData = async () => {
    try {
      setLoading(true);
      const patientData: any = await fetchPatientData(bed.patientID.toString());
      setPatient(patientData);
    } catch (e) {
      console.error('Error fetching patient data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inputRef && inputRef.current && !isDisabled) {
      console.log('Input Ref', inputRef);
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isDisabled]);

  useEffect(() => {
    if (isCardShown) loadPatientData();
  }, [isCardShown]);

  const showCard = () => {
    setCardShown(true);
  };

  const hideCard = () => {
    setCardShown(false);
  };

  return (
    <div
      className="patient-id-input-wrapper"
      {...props}
      onMouseEnter={showCard}
      onMouseLeave={hideCard}
    >
      <input
        type="text"
        className="patient-id-input text-center"
        disabled={isDisabled}
        ref={inputRef}
        value={value}
      />
      <button className="patient-id-input-edit-btn d-none" onClick={() => setDisabled(false)} />
      {isCardShown && (
        <div className="patient-card">
          {isLoading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <>
              <p className="mb-0 text-center mt-2">
                Name : <strong className="ml-2">{patient.name}</strong>
              </p>
              <div className="d-flex justify-content-between gap-2">
                <p className="mb-0 flex-1">
                  Date of Birth : <strong>{patient.dob}</strong>
                </p>
                <p className="mb-0 flex-1">
                  Gender : <strong>{patient.gender}</strong>
                </p>
              </div>
              <div className="d-flex justify-content-between gap-2">
                <p className="mb-0 flex-1">
                  Height : <strong>{patient.height}</strong>
                </p>
                <p className="mb-0 flex-1">
                  Weight : <strong>{patient.weight}</strong>
                </p>
              </div>
              <p className="mb-0">
                Admission time : <strong>{patient.dateOfAdmission}</strong>{' '}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientIdInput;
